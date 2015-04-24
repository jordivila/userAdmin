
jQuery.widget("ui.widgetModel", jQuery.ui.widgetBase,
{
    options: {
        modelItems: null,
        markOnChange: false // set a highlight class when item changed. Primarly used in filter objects
    },
    _create: function () {

        this._super();

        //jQuery(this.element)
        //.attr('data-widget', this.widgetName);
        //.addClass('ui-corner-all ui-widget-content');

        this._bindModelSchema(this.options.modelItems);
    },
    _init: function () {

        this._super();
    },
    destroy: function () {

        this._super();
    },
    _template: function () {
        return "<div class='ui-corner-bottom ui-widgetModel-content '></div>";


        //var valSummary = '' +
        //'<div class="ui-widgetForm-ValidationSummary ui-state-error ui-corner-all" data-widget="widgetFormSummary">' +
        //    '<span>Por favor, revise el formulario</span>' +
        //    '<ul>' +
        //        '<li modelKey="Email">El campo "Correo electrónico" es obligatorio</li>' +
        //        '<li modelKey="Password">El campo "Contraseña" es obligatorio</li>' +
        //    '</ul>' +
        //'</div>';

        //return "<div class='ui-corner-top ui-widget-header'>{0}</div><div class='ui-corner-bottom ui-widget-content ui-widgetModel-content'></div>" + valSummary;
    },
    _templateFormat: function () {
        return this._template();
    },
    val: function () {
        var o = this.cloneObject(this.options.modelItems);
        for (var i = 0; i < o.length; i++) {
            var propName = o[i].id;
            var propValue = jQuery(this.element).find('div[data-widgetModelItem-id="{0}"]:first'.format(propName)).widgetModelItem('val');
            o[i].currentValue = propValue;
        }
        return o;
    },
    valAsObject: function () {

        var r = this.val();
        var o = {};
        for (var i = 0; i < r.length; i++) {
            o[r[i].id] = r[i].currentValue;
        }
        return o;
    },
    _bindModelSchema: function () {

        var self = this;

        jQuery(this.element)
            .empty()
            .append(this._templateFormat());

        var $body = jQuery(this.element).find('div.ui-widgetModel-content:first');

        if (this.options.modelItems !== null) {

            var onItemChanged = function (e, ui) {

                var clearedErrors = true;

                for (var i = 0; i < self.options.modelItems.length; i++) {
                    if (jQuery(self.element).find('div[data-widgetModelItem-id="{0}"]:first'.format(self.options.modelItems[i].id))
                        .hasClass('ui-state-error')) {
                        clearedErrors = false;
                        break;
                    }
                }

                if (clearedErrors) {
                    self._trigger('errorsCleared', null, null);
                }

            };

            for (var i = 0; i < this.options.modelItems.length; i++) {
                var $f = jQuery('<div></div>');
                $body.append($f);

                $f.widgetModelItem(jQuery.extend({}, { change: onItemChanged }, this.options.modelItems[i]));
            }
        }
    },
    bindErrors: function (keyValueArray) {
        var self = this;
        for (var i = 0; i < keyValueArray.length; i++) {
            jQuery(self.element).find('div[data-widgetModelItem-id="{0}"]:first'.format(keyValueArray[i].key))
                .widgetModelItem('setErrors', keyValueArray[i].value)
                .addClass('ui-state-error');
        }
    },
    bindValue: function (dataItem) {

        var self = this;

        this._clearErrors();
        this.resetForm();

        for (var i in dataItem) {
            for (var j = 0; j < this.options.modelItems.length; j++) {
                if (this.options.modelItems[j].id == i) {
                    jQuery(self.element).find('div[data-widgetModelItem-id="{0}"]:first'.format(i))
                        .widgetModelItem('setValue', dataItem[i]);

                }
            }
        }
    },
    _clearErrors: function () {
        jQuery(this.element)
            .find('div.ui-widgetModelItem')
                .removeClass('ui-state-error')
                .find('div.ui-widgetModel-inputError')
                    .empty()
                    .addClass('ui-helper-hidden')
                .end()
            .end();
    },
    resetForm: function () {
        for (var j = 0; j < this.options.modelItems.length; j++) {
            jQuery(this.element).find('div[data-widgetModelItem-id="{0}"]:first'
                    .format(this.options.modelItems[j].id))
                    .widgetModelItem('setValue', null);
        }
    }
});
