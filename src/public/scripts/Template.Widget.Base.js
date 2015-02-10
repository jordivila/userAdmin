/// <reference path="VsixMvcAppResult.A.Intellisense.js" />

jQuery.widget("ui.widgetBase",
{
    options: {
        allowClose: false,                 // creates a close button on the top-right of a widget
        allowCollapse: false,          // creates a collapse button
        isCollapsed: false,             // initializes as a collapsed item
    },
    _create: function () {

        this._super();

        jQuery(this.element).addClass(this.namespace + '-' + this.widgetName);

        this.log(this.element);
        this.log(this.namespace + "." + this.widgetName + " -> create");
    },
    _init: function () {

        this._super();

        this.allowClose();
        this.allowCollapse();


        this.log(this.element);
        this.log(this.namespace + "." + this.widgetName + " -> init");

    },
    destroy: function () {

        this._super();

        this.log(this.namespace + "." + this.widgetName + " -> destroy");

    },
    log: function (logMessage) {
        if (window.console) {
            console.log(logMessage);
        }
    },
    addCss: function (css) {
        // TODO: check 'head' exists
        jQuery('head').append(css);
    },
    dumpProps: function (obj, parent, tmp) {
        // creates an array of name/value properties recursively
        // var propertiesArray = dumpProps(objectInstance, nullOrParentObject, []);
        for (var i in obj) {
            var tmpProp = { name: null, value: null };
            tmpProp.name = i;
            tmpProp.value = obj[i];
            tmp.push(tmpProp);
            if (typeof obj[i] == "object") {
                if (parent) {
                    tmp = this.dumpProps(obj[i], parent + "." + i, tmp);
                }
                else {
                    tmp = this.dumpProps(obj[i], i, tmp);
                }
            }
        }
        return tmp;
    }, 
    boxButtonsContainerGet: function () {
        var self = this;

        if(jQuery(this.element)
            .find('div.ui-widget-header:first')
                .find('div.ui-widget-boxButtons:first')
                .length === 0)
        {
            jQuery(this.element)
                .find('div.ui-widget-header:first')
                    .wrapInner("<div class='ui-widget-headerText'></div>")
                    .append('<div class="ui-widget-boxButtons"></div>');
        }

        return jQuery(this.element)
                .find('div.ui-widget-header:first')
                    .find('div.ui-widget-boxButtons:first');
    }, 
    allowClose: function () {

        if (this.options.allowClose) {

            var self = this;

            var $p = self.boxButtonsContainerGet();

            $p.append('<div class="ui-widget-close ui-corner-all ui-icon ui-icon-close"></div>')
              .find('div.ui-widget-close:first')
                .click(function () {
                    jQuery(self.element).toggle();
                })
                .show();
        }
    }, 
    allowCollapse: function () {

        if (this.options.allowCollapse) {
            var self = this;

            var collapseFunc = function () {
                var $content = jQuery(self.element).find('div.ui-widget-content');
                $content.toggle();
                jQuery(self.element).find('div.ui-widget-collapse:first').toggleClass('ui-icon-triangle-1-n', $content.is(':visible')).toggleClass('ui-icon-triangle-1-s', !$content.is(':visible'));
                self._trigger('onCollapsed', null, $content.is(':visible') ? true : false);
            };

            var $p = self.boxButtonsContainerGet();

            $p.append('<div class="ui-widget-collapse ui-corner-all ui-icon ui-icon-triangle-1-s"></div>')
              .find('div.ui-widget-collapse:first')
              .click(function (e) {

                  var $c = jQuery(e.target);

                  if ($c.is("div") && $c.hasClass("ui-widget-collapse")) {
                      collapseFunc();
                  }
                  else {
                      if ($c.is("span") && $c.parents("div:first").hasClass("ui-widget-collapse")) {
                          collapseFunc();
                      }
                  }
              })
              .removeClass('ui-icon-triangle-1-n')
              .addClass('ui-icon-triangle-1-s')
              .show();

            if (self.options.isCollapsed) {
                collapseFunc();
            }
        }
    }
});