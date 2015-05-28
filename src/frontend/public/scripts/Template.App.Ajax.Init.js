define(["jquery", "/public/scripts/Template.App.Init.js"],
       function ($) {


           jQuery(document).ready(function () {
               jQuery.ajaxSetup({
                   type: "GET",
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   beforeSend: function (xhr, settings) {

                       var urlHelper = new UrlHelper(settings.url);

                       if (urlHelper.hostname == window.location.hostname) {
                           settings.url = new UrlHelper(settings.url).paramSet("appVersion", appVersion).href;
                           settings.url = new UrlHelper(settings.url).paramSet("seoRequest", false).href;
                       }
                   }
               });
           });

           VsixMvcAppResult.Ajax = {};

           VsixMvcAppResult.Ajax.onOkKoComplete = function (opts, onOK, onKO, onComplete) {

               var jqxhr = jQuery.ajax(opts)
                                   .done(function (data, textStatus, jqXHR) {
                                       onOK(data);
                                   })
                                   .fail(function (jqXHR, textStatus, errorThrown) {
                                       onKO(jqXHR);
                                   })
                                   .always(function (jqXHR, textStatus, errorThrown) {
                                       onComplete();
                                   });

               return jqxhr;
           };

           VsixMvcAppResult.Ajax.UserMenu = function (onOK, onKO, onComplete) {
               VsixMvcAppResult.Ajax.onOkKoComplete({
                   url: "/api/user/menu",
                   type: "GET",
                   data: {},
                   cache: false
               }, onOK, onKO, onComplete);
           };

  return VsixMvcAppResult;
  });