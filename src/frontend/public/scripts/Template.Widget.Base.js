var progressBoxSelector = "#progressFeedBack";

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


        this.progressInit();

        //this.log(this.element);
        //this.log(this.namespace + "." + this.widgetName + " -> create");
    },
    _init: function () {

        this._super();

        this.allowClose();
        this.allowCollapse();


        //this.log(this.element);
        this.log("{0}.{1}->Init->{2}".format(this.namespace, this.widgetName, jQuery(this.element)[0].className));

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
    //addCss: function (css) {
    //    // TODO: check 'head' exists
    //    jQuery('head').append(css);
    //},
    //cloneObject: function (obj) {


    //    console.log("ppppppppp");
    //    console.log(obj);

    //    var o = jQuery.extend({}, obj, obj);

    //    console.log(o);


    //    //var copy;

    //    //// Handle the 3 simple types, and null or undefined
    //    //if (null === obj || "object" != typeof obj) return obj;

    //    //// Handle Date
    //    //if (obj instanceof Date) {
    //    //    copy = new Date();
    //    //    copy.setTime(obj.getTime());
    //    //    return copy;
    //    //}

    //    //// Handle Array
    //    //if (obj instanceof Array) {
    //    //    copy = [];
    //    //    for (var i = 0, len = obj.length; i < len; i++) {
    //    //        copy[i] = this.cloneObject(obj[i]);
    //    //    }
    //    //    return copy;
    //    //}

    //    //// Handle Object
    //    //if (obj instanceof Object) {
    //    //    copy = {};
    //    //    for (var attr in obj) {
    //    //        if (obj.hasOwnProperty(attr)) copy[attr] = this.cloneObject(obj[attr]);
    //    //    }
    //    //    return copy;
    //    //}

    //    //throw new Error("Unable to copy obj! Its type isn't supported.");
    //},
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


    progressInit: function () {

        // only one progressFeedback per page
        var self = this;

        if (jQuery(progressBoxSelector).length === 0) {
            jQuery('body').prepend('<div id="progressFeedBack" class="ui-progress-feedback ui-widget-overlay"><div class="ui-widget ui-widget-content ui-state-active ">Please wait while loading</div></div>');

            /*
            // these lines do not work on mobile
            jQuery(document)
                .click(function (e) {
                    jQuery(progressBoxSelector).find('div:first').css('top', (e.clientY + 20));
                });
            */
        }
    },
    progressShow: function (msg) {

        console.log("Info->" + msg);

        var $p = jQuery(progressBoxSelector);

        $p
        .addClass('ui-front')
        .find('div:first')
            .html(msg)
        .end()
        .show();
    },
    progressHide: function () {
        jQuery(progressBoxSelector).removeClass('ui-front').hide();
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

        console.log("Error->" + msg);

        jQuery(this.options.errorDOMId)
                .addClass('ui-state-error')
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



    //dfdFillCombo: function (selector, KeyValuePairArray) {
    //    var dfd = jQuery.Deferred();
    //    try {
    //        var $domObj = jQuery(selector);

    //        $domObj.find('option').remove();

    //        for (var i = 0; i < KeyValuePairArray.length; i++) {
    //            $domObj.append(jQuery("<option />").val(KeyValuePairArray[i].value).text(KeyValuePairArray[i].name));
    //        }

    //        dfd.resolve();
    //    }
    //    catch (e) {
    //        dfd.reject("Error inicializando el formulario: " + e.message);
    //    }
    //    return dfd.promise();
    //}




});