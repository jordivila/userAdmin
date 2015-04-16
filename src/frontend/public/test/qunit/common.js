


var server = {
    name : window.location.hostname === ''?'localhost':window.location.hostname,
    port : window.location.hostname === ''?3000:window.location.port, 
    getBaseAddress: function () {
        return "http://" + this.name + ":" + this.port;
    }
};


var getRandomString = function (stringLength) {
    var s = "";
    while (s.length < stringLength && stringLength > 0) {
        var r = Math.random();
        s += (r < 0.1?Math.floor(r * 100):String.fromCharCode(Math.floor(r * 26) + (r > 0.5?97:65)));
    }
    return s;
};



