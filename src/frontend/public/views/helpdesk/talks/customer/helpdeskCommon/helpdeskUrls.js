define([
],
function () {

    var helpdeskUrls = {
        baseAddress: '/helpdesk/talks/customer/',
        home: 'home',
        subject: function () {
            return 'subject/';
        },
        history: function () {
            return 'history/';
        },
        message: function (idTalk) {
            return 'message/?idTalk=' + idTalk;
        },
    };


    return helpdeskUrls;

});