define([
    "jquery",
    "jqueryui",
    "scripts/Template.ExtendPrototypes"
],
function ($, jqUI) {

    jQuery.widget("ui.widgetBase",
    {
        options: {
            allowClose: false,      // creates a close button on the top-right of a widget
            allowCollapse: false,   // creates a collapse button
            isCollapsed: false,     // initializes as a collapsed item
            onCollapsed: function (e, isVisible) { },      // callback used when onCollapsed is fired 

            errorDOMId: null,       // in case widget needs feedback error messages
            messagesDOMId: null     // in case widget needs feedback success messages

        },
        _create: function () {

            this._super();

            jQuery(this.element).addClass(this.namespace + '-' + this.widgetName);


            //this.progressInit();

            //this.log(this.element);
            //this.log(this.namespace + "." + this.widgetName + " -> create");
        },
        _init: function () {

            this._super();

            this.allowClose();
            this.allowCollapse();



            //this.log("{0}.{1}->Init->{2}".format(this.namespace, this.widgetName, jQuery(this.element)[0].className));

            var widgetName = this.namespace + '.' + this.widgetName;
            var dataWidgetInitialized = widgetName + ".IsInitialized";

            if (jQuery(this.element).data(dataWidgetInitialized) === undefined) {
                jQuery(this.element).data(dataWidgetInitialized, true);
            }
            else {
                throw new Error("Widget is already initialized. Reinitializing would duplicate events." + widgetName);
            }


        },
        destroy: function () {

            this._super();

            //jQuery.removeData(jQuery(this.element)); // ??

            this.log(this.namespace + "." + this.widgetName + " -> destroy");


        },
        log: function (logMessage) {
            if (window.console) {
                console.log(logMessage);
            }
        },
        boxButtonsContainerGet: function () {
            var self = this;

            if (jQuery(this.element)
                .find('div.ui-widget-header:first')
                    .find('div.ui-widget-boxButtons:first')
                    .length === 0) {
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
                    self._trigger('onCollapsed', null, ($content.is(':visible') ? true : false));
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
        },


        progressShow: function (msg) {

            console.log("Info->" + msg);

            var $p = jQuery(globals.domIds.panelProgress);

            $p
            .addClass('ui-front')
            .find('span:first')
                .html(msg)
            .end()
            .show();
        },
        progressHide: function () {
            jQuery(globals.domIds.panelProgress).removeClass('ui-front').hide();
        },

        errorInit: function (parent) {

            if (parent) {

                var errorCustomDOMClassName = this.namespace + '-' + this.widgetName + '-errDisplayBox';
                var highlightCustomDOMClassName = this.namespace + '-' + this.widgetName + '-highlightDisplayBox';


                var template = '<div class="ui-crud-error {0} ui-state-error ui-helper-hidden"></div>' +
                                '<div class="ui-crud-info {1} ui-state-highlight ui-helper-hidden"></div>';

                template = template.format(errorCustomDOMClassName, highlightCustomDOMClassName);

                jQuery(this.element).find(parent).append(template);

                this.options.errorDOMId = jQuery(this.element).find('div.' + errorCustomDOMClassName + ':first');
                this.options.messagesDOMId = jQuery(this.element).find('div.' + highlightCustomDOMClassName + ':first');

                this.errorHide();
                this.messageHide();
            }
        },
        errorDisplay: function (msg, cb) {

            console.error("Error->" + msg);

            jQuery(this.options.errorDOMId)
                    .addClass('ui-state-error')
                    .removeClass('ui-helper-hidden') 
                    .html(msg)
                    .fadeTo('slow', 1, function () {
                        if (jQuery.isFunction(cb)) {
                            cb();
                        }
                    });
        },
        errorHide: function (cb) {

            var self = this;

            jQuery(this.options.errorDOMId)
                .removeClass('ui-state-error')
                .addClass('ui-helper-hidden')
                .html('')
                .fadeTo('slow', 0, function () {
                    if (jQuery.isFunction(cb)) {
                        cb();
                    }
                });
        },

        messageDisplay: function (msg, cb) {
            jQuery(this.options.messagesDOMId)
                .addClass('ui-state-highlight')
                .removeClass('ui-helper-hidden')
                .html(msg)
                .fadeTo('slow', 1, function () {
                    if (jQuery.isFunction(cb)) {
                        cb();
                    }
                });
        },
        messageHide: function (cb) {

            var self = this;

            jQuery(this.options.messagesDOMId)
                .removeClass('ui-state-highlight')
                .addClass('ui-helper-hidden')
                .html('')
                .fadeTo('slow', 0, function () {
                    if (jQuery.isFunction(cb)) {
                        cb();
                    }
                });
        },
        messagedisplayAutoHide: function (msg, miliseconds) {

            var time = 3000;
            var self = this;

            if (miliseconds) {
                time = miliseconds;
            }

            this.messageDisplay(msg,
                function () {
                    jQuery(self.options.messagesDOMId)
                        .delay(time)
                        .fadeTo(time, 0, function () { self.messageHide(); });
                });
        },

    });

});