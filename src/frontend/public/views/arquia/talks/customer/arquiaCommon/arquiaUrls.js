define([
],
function () {

    var arquiaUrls = {
        baseAddress: '/arquia/talks/customer/',
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


    return arquiaUrls;

});