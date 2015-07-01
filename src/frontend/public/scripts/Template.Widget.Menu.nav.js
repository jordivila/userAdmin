define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Ajax.Init",
    "scripts/Template.Widget.Menu.slides",
    "scripts/Template.App.I18n.Init", ],
       function ($, jqUI, clientApp, wSlides,cliI18n) {

           jQuery.widget("ui.menuNav", jQuery.ui.widgetBase, {
               options: {

               },
               _create: function () {
                   this._super();
               },
               _init: function () {

                   this._super();

                   this._initMenuNav();
               },
               destroy: function () {
                   this._super();
               },
               _errMsgSet: function (selector, msg) {
                   jQuery(selector)
                       .append("<div class='userActiviyErrMsg ui-state-error'></div><div class='ui-helper-clearfix'></div>")
                       .find("div.userActiviyErrMsg:first")
                       .html(msg);
               },
               _initMenuNav: function () {

                   //TODO: load async Menu based on user identity
                   var self = this;
                   var $sitePage = jQuery('div.ui-sitePage:first');
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
                   




                   $panelMenuList.menuSlides({
                       selected: function (e, templ) {

                           var templGetFunc = function () {
                               self._trigger('selected', null, templ);
                           };

                           if ($panelMenuToggle.is(':visible')) {
                               panelMenuHide(function () {
                                   templGetFunc();
                               });
                           }
                           else {
                               templGetFunc();
                           }
                       },
                       done: function (e) {
                           self._initMenuSelected($panelMenuList);
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


                   clientApp.Ajax.UserMenu(function (err, data) {

                       if (err !== null) {
                           self._errMsgSet($panelMenu, clientApp.i18n.texts.get("Views.Layout.UnExpectedError"));
                       }
                       else {
                           $panelMenuList.menuSlides('bind', data);
                       }

                       self._trigger('complete', null, null);
                   });

               },
               _initMenuSelected: function ($widgetMenuList) {

                   var pathName = location.pathname;

                   $widgetMenuList.menuSlides('select', function (menuItem) {

                       if (menuItem.url == pathName) {
                           return true;
                       }
                   });


               },

           });


       });
