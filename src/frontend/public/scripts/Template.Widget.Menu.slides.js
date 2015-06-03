define(["jquery", "jqueryui", "scripts/Template.Widget.Menu.base"],
       function ($, jqUI) {


           jQuery.widget("ui.menuSlides", jQuery.ui.menuBase, {
               options: {
                   //slidesOpened: [], //http://bugs.jqueryui.com/ticket/8645
                   slidesOpened: null, //since jQuery.ui 1.9 array options are static. So initialized them on create event,
                   texts: {
                       back: "Back"
                   }
               },
               _create: function () {

                   this._super();

                   this.options.slidesOpened = [];

                   jQuery(this.element).prepend('<div class="ui-menuSlide-backButton ui-helper-hidden ui-state-default"><span class="ui-icon ui-icon-triangle-1-w"></span><span>' + this.options.texts.back + '</span><div class="ui-helper-clearfix"></div></div>');

               },
               _init: function () {
                   this._super();
                   this._initBackButton();
               },
               _initBackButton: function () {

                   var self = this;
                   var $backButton = jQuery(this.element).find('div.ui-menuSlide-backButton:first');


                   $backButton
                       .click(function () {

                           var $selectedItem = jQuery(self.element).find('div.ui-menuList-itemLink.ui-state-highlight:first').parents('li:first');

                           if ($selectedItem.length > 0) {
                               var itemPath = self._itemPath($selectedItem, []);



                               for (var i = 0; i < itemPath.length; i++) {
                                   jQuery(itemPath[i]).find('div.ui-menuList-itemLink:first').addClass('ui-state-active');
                               }
                           }


                           jQuery(self.element)
                               .find('ul.ui-menuList-childs:visible:first')
                               .each(function () {

                                   var theListToHide = jQuery(this);
                                   var theListToShow = self.options.slidesOpened[self.options.slidesOpened.length - 1];
                                   self._animatePanel(theListToHide, theListToShow, false, function () {
                                       self.options.slidesOpened.splice(self.options.slidesOpened.length - 1, 1);
                                       if (self.options.slidesOpened.length === 0) {
                                           $backButton.addClass('ui-helper-hidden');
                                       }
                                   });
                               });
                       });
               },
               destroy: function () {
                   this._super();
               },
               _beforeSelected: function () {
                   jQuery(this.element)
                       .find('div.ui-menuList-itemLink')
                           .removeClass('ui-state-highlight ui-state-active')
                       .end();
               },
               _animatePanel: function ($hidingList, $showingList, forward, cb) {

                   if (forward) {
                       $hidingList.hide('drop', function () {
                           $showingList.show('slide', function () {
                               cb();
                           });
                       });
                   }
                   else {
                       $hidingList.hide('drop', function () {
                           $showingList.show('slide', function () {
                               cb();
                           });
                       });
                   }

               },
               openNode: function ($lisOpen) {

                   var self = this;

                   var matches = function ($ul) {
                       for (var i = 0; i < $lisOpen.length; i++) {
                           if (jQuery($ul.data('parentNode'))[0] == $lisOpen[0]) {
                               return true;
                           }
                       }
                       return false;
                   };


                   jQuery(self.element)
                       .find('ul.ui-menuList-childs')
                       .each(function () {

                           if (matches(jQuery(this))) {

                               var theListToShow = jQuery(this);

                               jQuery(self.element)
                                   .find('ul.ui-menuList-childs:visible:first')
                                       .each(function () {
                                           var theListToHide = jQuery(this);
                                           self.options.slidesOpened.push(theListToHide);
                                           self._animatePanel(theListToHide, theListToShow, true, function () {

                                               jQuery(self.element)
                                                   .find('div.ui-menuSlide-backButton:first')
                                                   .removeClass('ui-helper-hidden');

                                           });
                                       });
                           }
                       });
               },
               closeNode: function ($lisClose) {

               },
               collapseAll: function () {

                   jQuery(this.element)
                       .find('ul.ui-menuList-childs')
                       .each(function () {
                           if (jQuery(this).data('parentNode') !== undefined) {
                               jQuery(this).hide();
                           }
                       });
               },
               _build: function () {

                   var self = this;
                   var dfd = jQuery.Deferred();

                   var menuItemRender = function (IMenuItem) {
                       var $li = jQuery('<li class="ui-menuList-item ui-widget-content ui-corner-all ui-state-default"></li>');
                       $li.html('<div class="ui-menuList-itemLink ui-state-default"><span class="ui-menuList-link">{0}</span><div class="ui-helper-clearfix" /></div>'.format(IMenuItem.text));
                       $li.data('dataItem', IMenuItem);

                       if (IMenuItem.childs) {

                           $li.find('div.ui-menuList-itemLink')
                                   .find('div.ui-helper-clearfix:first')
                                       .before('<div class="ui-menuList-toggle ui-state-default ui-icon ui-icon-triangle-1-e"></div>')
                                   .end()
                              .end();

                           menuLevelRender(IMenuItem.childs, $li);
                       }
                       return $li;
                   };

                   var menuLevelRender = function (ImenuLevel, $parentLevel) {

                       var $ul = jQuery('<ul class="ui-menuList-childs"></ul>');

                       if (jQuery($parentLevel).length > 0) {
                           $ul.data('parentNode', $parentLevel);
                       }

                       jQuery(self.element).append($ul);

                       for (var i = 0; i < ImenuLevel.length; i++) {
                           $ul.append(menuItemRender(ImenuLevel[i]));
                       }

                   };

                   var menuRender = function () {

                       menuLevelRender(self.options.IMenuModel);

                       dfd.resolve();
                   };

                   menuRender();


                   return dfd.promise();
               },
               _itemPath: function ($li, currentPath) {

                   if ($li) {

                       currentPath.push($li);

                       if ($li.parents('ul:first').length > 0) {
                           return this._itemPath($li.parents('ul:first').data('parentNode'), currentPath);
                       }
                       else {
                           return currentPath;
                       }

                   }
                   else {
                       return currentPath;
                   }
               },
               _itemSlidesPath: function ($currentSlideUl, currentSlidePath) {

                   currentSlidePath.push($currentSlideUl);

                   var $pNode = $currentSlideUl.data('parentNode');

                   if ($pNode) {
                       return this._itemSlidesPath(jQuery($pNode).parents('ul.ui-menuList-childs:first'), currentSlidePath);
                   }
                   else {
                       // top parent found
                       return currentSlidePath.reverse();
                   }
               },
               _itemSlidesPathInit: function () {

                   for (var i = 0; i < this.options.slidesOpened.length; i++) {
                       jQuery(this.options.slidesOpened[i]).hide();
                   }

                   jQuery(this.options.slidesOpened[this.options.slidesOpened.length - 1]).show();

                   if (this.options.slidesOpened.length > 1) {
                       jQuery(this.element)
                           .find('div.ui-menuSlide-backButton:first')
                           .removeClass('ui-helper-hidden');
                   }

               },

               select: function (setSelected) {

                   var self = this;

                   self.options.slidesOpened = [];

                   var slidesPath = [];

                   jQuery(self.element)
                       .find('li.ui-menuList-item')
                           .each(function () {
                               if (setSelected(jQuery(this).data('dataItem'))) {
                                   self._setSelectedCss(jQuery(this));
                                   self.options.slidesOpened = self._itemSlidesPath(jQuery(this).parents('ul.ui-menuList-childs:first'), []);
                                   self._itemSlidesPathInit();
                                   self.options.slidesOpened.pop();
                               }
                           });
               }
           });


       });