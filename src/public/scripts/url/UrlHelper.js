function UrlHelper(strURI) {
    return this.bind(strURI);
}


UrlHelper.prototype.bind = function (strURI) {

    var a = document.createElement('a');
    a.href = strURI;

    this.hash = a.hash;
    this.host = a.host;
    this.hostname = a.hostname;
    this.href = a.href;
    this.origin = a.origin;
    this.pathname = a.pathname;
    this.port = a.port;
    this.protocol = a.protocol;
    this.search = a.search;

    return this;
};

UrlHelper.prototype.isValid = function () {
    throw new Error("Not implemented extension");
};

UrlHelper.prototype.paramSet = function (key, value) {

    if (arguments.length == 2) {

        var addOrReplaceUrlParameter = function (url, paramName, paramValue) {
            var hashSplit = url.split('#');
            var paramSplit = hashSplit[0].split('?');
            var encodedParamName = encodeURIComponent(paramName);
            var encodedParamValue = encodeURIComponent(paramValue);
            if (paramSplit[1]) {
                if (paramSplit[1].match(new RegExp("(^|\&)" + encodedParamName + "="))) {
                    var match = new RegExp('(' + encodedParamName + ')' + "=.*?(\\&|$)");
                    paramSplit[1] = paramSplit[1].replace(match, '$1=' + encodedParamValue + '$2');
                } else {
                    paramSplit[1] += "&" + encodedParamName + '=' + encodedParamValue;
                }
            } else {
                paramSplit.push(encodedParamName + '=' + encodedParamValue);
            }
            return paramSplit.join('?') + (hashSplit[1] ? "#" + hashSplit[1] : '');
        };

  
        return this.bind(addOrReplaceUrlParameter(this.href, key, value));

    }
    else {
        throw new Error("Argument exception");
    }
};



