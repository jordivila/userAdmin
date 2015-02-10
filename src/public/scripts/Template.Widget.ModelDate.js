
jQuery.widget("ui.widgetModelItemDate", jQuery.ui.widgetBase,
{
    options: {
        value: null,
        text: VsixMvcAppResult.Resources.clickToPickDate
    },
    _create: function () {
        this._super();
    },
    _init: function () {

        var self = this;

        this._super();

        if (!jQuery(this.element).hasClass('hasDatepicker')) {

            jQuery(this.element)
                .hide()
                .datepicker({
                    showButtonPanel: true,
                    changeMonth: true,
                    changeYear: true,
                    gotoCurrent: true,
                    onSelect: function () {
                        self._setDateLabel();
                    }
                });

            

            if (jQuery(this.element).attr('data-isWrapped') === undefined) {
                jQuery(this.element).wrap('<div class="ui-widgetModelItemDate"></div>')
                                    .parents('div.ui-widgetModelItemDate:first')
                                    .append('<a href="javascript:void(0);">' + self.options.text + '</a>')
                                    .append('<div class="ui-state-error"><span class="ui-icon ui-icon-circle-close"></span></div>')
                                    .find('div.ui-state-error')
                                        .css('width', '17')
                                        .css('height', '17')
                                        .css('margin-right', '10px')
                                        .css('float', 'left')
                                        .css('cursor', 'pointer')
                                        .hide();
            }

            jQuery(this.element)
                .parents('div:first')
                    .find('div.ui-state-error')
                        .click(function () {
                            jQuery(this).hide();
                            jQuery(self.element)
                                    .val('')
                                    .parents('div:first')
                                        .find('a')
                                            .html(self.options.text);
                        })
                    .end()
                    .find('a')
                        .click(function () {
                            jQuery(self.element).datepicker('show');
                        });

            jQuery(this.element).datepicker('setDate', self.options.value);
            if (self.options.value !== null) {
                self._setDateLabel();
            }
        }
    },
    destroy: function () {

        jQuery(this.element).unwrap();

        this._super();
    },
    _setDateLabel: function () {
        var self = this;
        jQuery(self.element)
            .parents('div:first')
            .find('a')
                .html(Globalize.format(jQuery(self.element).datepicker('getDate'), "D"))
            .end()
            .find('div')
                .show();
    },
    getDate: function () {
        if (jQuery(this.element).find('input').val() !== '') {
            return jQuery(this.element).find('input').datepicker('getDate');
        }
        else {
            return null;
        }
    },
});