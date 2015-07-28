define([
    'querystring' // https://github.com/jgallen23/querystring class
],
function (querystring) {

    function UrlHelper(strURI) {

        if (strURI) {
            return this.bind(strURI);
        }
        else {
            return this.bind(document.location.href);
        }

    }

    UrlHelper.prototype._bind = function (strURI) {

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
        this.query = {};
        this.query.parsed = querystring.parse(this.search.replace('?', ''));
        this.query.stringified = querystring.stringify(this.query.parsed);

        return this;
    };

    UrlHelper.prototype.bind = function (strURI) {

        /*
        IE bug fix ->
            1.- most browsers just need "return this.bind(strURI)" to work fine.
            2.- IE sets 'this.hostname' as an empty string when strURI is a relative Url like '/home'
            3.- At least IE returns href completed when using relative Url
            4.- Thus, just need to re-bind using this.href value of the first try
        */

        return this._bind(this._bind(strURI).href);


        /*
            if(browser==IE)
            {
                return this.bind(this.bind(strURI).href);
            }
            else
            {
                return this.bind(strURI);
            }
        */


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
                    if (paramSplit[1].match(new RegExp("(^|\\&)" + encodedParamName + "="))) {
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

    return UrlHelper;

});