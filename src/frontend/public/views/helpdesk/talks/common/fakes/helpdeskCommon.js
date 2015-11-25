define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
],
function ($, jqUI, clientApp) {


    function HelpdeskCommon() {
        this.methods = {
            setTitleWiki: function () {
                jQuery('h1:first')
                    .html(function () {
                        return '<div class="ui-helpdesk-needHelp"><i class="fa fa-question-circle"></i>{0}</div>'.format(clientApp.i18n.texts.get("Helpdesk.Talks.NeedHelp"));
                    })
                    .find('div.ui-helpdesk-needHelp')
                        .click(function () {
                            clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.wiki()));
                        })
                        .css('cursor', 'pointer')
                    .end();
            }
        };

        this.helpdeskUrls = {
            baseAddress: null,//'/' + globals.domainInfo.virtualDirectory + 'helpdesk/talks/customer/',
            home: 'home/',
            subject: function () {
                return 'subject/';
            },
            history: function () {
                return 'history/';
            },
            message: function (idTalk) {
                return 'message/?idTalk=' + idTalk;
            },
            wiki: function () {
                return 'wiki/';
            }
        };
    }

    return HelpdeskCommon;

    //var helpdeskCommon = {

    //    methods: {
    //        setTitleWiki: function () {
    //            jQuery('h1:first')
    //                .html(function () {
    //                    return '<div class="ui-helpdesk-needHelp"><i class="fa fa-question-circle"></i>{0}</div>'.format(clientApp.i18n.texts.get("Helpdesk.Talks.NeedHelp"));
    //                })
    //                .find('div.ui-helpdesk-needHelp')
    //                    .click(function () {
    //                        clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.wiki()));
    //                    })
    //                    .css('cursor', 'pointer')
    //                .end();
    //        }
    //    },
    //    helpdeskUrls: {
    //        baseAddress: '/' + globals.domainInfo.virtualDirectory + 'helpdesk/talks/customer/',
    //        home: 'home/',
    //        subject: function () {
    //            return 'subject/';
    //        },
    //        history: function () {
    //            return 'history/';
    //        },
    //        message: function (idTalk) {
    //            return 'message/?idTalk=' + idTalk;
    //        },
    //        wiki: function () {
    //            return 'wiki/';
    //        }
    //    }
    //};

    //return helpdeskCommon;

});