
jQuery.widget("ui.userActivity", jQuery.ui.widgetBase, {
    options: {

    },
    _create: function () {
        this._super();
    },
    _init: function () {

        this._super();

        //this.initMenuNav();
        this._updateUserLastActivity();
    },
    destroy: function () {
        this._super();
    },
    _errMsgSet: function (selector, msg) {
        jQuery(selector)
            .append("<div></div><div class='ui-helper-clearfix'></div>")
            .find("div:first")
            .html(msg);

        VsixMvcAppResult.Widgets.DialogInline.Create(jQuery(selector).find("div:first"), VsixMvcAppResult.Widgets.DialogInline.MsgTypes.Error);
    },
    _updateUserLastActivity: function () {
        var self = this;

        VsixMvcAppResult.Ajax.UserUpdateLastActivity(
            function (data, textStatus, jqXHR) {
                jQuery(self.element).append(data);
                //VsixMvcAppResult.Widgets.jQueryzer(self.element);
            },
            function (jqXHR, textStatus, errorThrown) {
                self._errMsgSet(jQuery(self.element), VsixMvcAppResult.Resources.unExpectedError);
            },
            function () {
                //self._trigger('complete', null, null);
                self._initMenuNav();
            });
    },
    _initMenuNav: function () {

        //TODO: load async Menu based on user identity
        var self = this;
        var $sitePage = jQuery('div.ui-sitePage:first');
        var $siteContent = jQuery('div.ui-siteContent:first');
        var $panelMenu = jQuery('#panelMenu');
        var $panelMenuList = jQuery($panelMenu).find('div.ui-menuBase:first');
        var $panelMenuToggle = jQuery('div.ui-mainMenuToggle');

        var panelMenuHide = function (cb) {
            $sitePage.show();
            $panelMenu.hide('slide', function () {
                $panelMenu.removeClass('ui-front');

                if (jQuery.isFunction(cb)) {
                    cb();
                }
            });
        };
        var panelMenuShow = function (cb) {
            $panelMenu
                .addClass('ui-front')
                .show('drop', function () {
                    $sitePage.hide();

                    if (jQuery.isFunction(cb)) {
                        cb();
                    }
                });
        };
        var panelMenuToggleOnClick = function (cb) {
            if ($panelMenu.is(':visible')) {
                panelMenuHide(cb);
            }
            else {
                panelMenuShow(cb);
            }
        };

        var loadTemplate = function (templUrl) {


            $siteContent.empty();

            // ask for the template
            jQuery.ajax({
                url: templUrl,
                type: "GET",
                dataType: "html",
            })
            .done(function (data, textStatus, jqXHR) {

                var templatePartialCssFiles = "{{#each CssFiles}}<link href='{{this}}' rel='Stylesheet' type='text/css' />{{/each}}";
                var templatePartialJsFiles = "{{#each JsFiles}}<script type='text/javascript' src='{{this}}'></script>{{/each}}";
                var template = Handlebars.compile(data + templatePartialCssFiles + templatePartialJsFiles);
                var templateContext = {};


                // ask for the template context
                jQuery.ajax({
                    url: templUrl + 'index.handlebars.json',
                    type: "GET",
                    dataType: "json",
                })
                .done(function (dataJson, textStatusJson, jqXHRJson) {
                    var html = template(jQuery.extend({}, dataJson, templateContext));
                    $siteContent.html(html);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {

                    // specific template context fail to load. 
                    // try transform with basic template context
                    var html = template(templateContext);
                    $siteContent.html(html);


                    //console.error("Error lading template '{0}' ->".format(templUrl), {
                    //    jqXHR: jqXHR,
                    //    textStatus: textStatus,
                    //    errorThrown: errorThrown
                    //});

                    //$siteContent.html('<div class="ui-state-error ui-site-templateInfo">Error loading template: {0} - {1} - {2} </div>'.format(jqXHR.status, textStatus, errorThrown));

                })
                .always(function () {
                    self.progressHide();
                });

            })
            .fail(function (jqXHR, textStatus, errorThrown) {

                console.error("Error lading template '{0}' ->".format(templUrl), {
                    jqXHR: jqXHR,
                    textStatus: textStatus,
                    errorThrown: errorThrown
                });

                $siteContent.html('<div class="ui-state-error ui-site-templateInfo">Error loading template: {0} - {1} - {2} </div>'.format(jqXHR.status, textStatus, errorThrown));

            })
            .always(function () {
                self.progressHide();
            });

        };



        //var State = History.getState();
        // Bind to State Change
        History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate

            self.progressShow('Loading template');

            // Log the State
            var State = History.getState(); // Note: We are using History.getState() instead of event.state
            History.log('statechange:', State.data, State.title, State.url);


            loadTemplate(State.hash);
        });




        $panelMenu.hide();

        $panelMenuList.menuSlides({
            selected: function (e, templ) {

                var templGetFunc = function () {

                    var templUrl = templ.url;

                    History.pushState(null, null, templUrl);

                    //loadTemplate(templUrl);
                };

                if ($panelMenuToggle.is(':visible')) {
                    panelMenuHide(setTimeout(function () {
                        templGetFunc();
                    },
                    500));
                }
                else {
                    templGetFunc();
                }
            }
        });


        /* Begin Ensure panel animations:
            1.- prevent clicking twice the same toggle button before panel animations are done
            2.- prevent adding click events twice
        */
        var panelMenuToggleClickBind = null;

        panelMenuToggleClickBind = function () {
            $panelMenuToggle
                .one('click', function () {
                    $panelMenuToggle.unbind('click');
                    panelMenuToggleOnClick(function () {
                        panelMenuToggleClickBind();
                    });
                });
        };

        panelMenuToggleClickBind();
        /* End Ensure panel animations */


        VsixMvcAppResult.Ajax.UserMenu(
            function (data, textStatus, jqXHR) {
                $panelMenuList.menuSlides('bind', data);
            },
            function (jqXHR, textStatus, errorThrown) {
                self._errMsgSet($panelMenu, VsixMvcAppResult.Resources.unExpectedError);
            },
            function () {
                self._trigger('complete', null, null);
            });
    }
});