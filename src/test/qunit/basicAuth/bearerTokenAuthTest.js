(function (QUnit, P) {

    //'use strict';


    var baseUrl = "http://apiarquia.cloudapp.net";
    var client_id = "integrationtest";
    var userGenerate = function () {
        return {
            DocumentId: "12345678Z",
            UserName: "Manolito"
        };
    };
    var userViewTypes = function () {
        return {
            Default: 0,
            Global: 1,
            Cancelled: 2,
            Custom: 3,
        };
    }();
    var userProductFamilies = function () {
        return {
            /// <summary>
            /// Cuentas
            /// </summary>
            Accounts: 0,
            /// <summary>
            /// Fondos de Pensiones
            /// </summary>
            PensionFunds: 1,
            /// <summary>
            /// Medios de Pago
            /// </summary>
            PaymentMethods: 2,
            /// <summary>
            /// Préstamos
            /// </summary>
            Loans: 3,
            /// <summary>
            /// Seguros
            /// </summary>
            Insurances: 4,
            /// <summary>
            /// Banca Privada
            /// </summary>
            PrivateBanking: 5,
            /// <summary>
            /// Deuda Pública
            /// </summary>
            NationalDebt: 6,
            /// <summary>
            /// Letras del Tesoro
            /// </summary>
            TreasuryBills: 7,
            /// <summary>
            /// Imposiciones a Plazo Fijo
            /// </summary>
            FixedTermDeposits: 8,
            /// <summary>
            /// Pólizas de Crédito
            /// </summary>
            CreditPolicies: 9,
            /// <summary>
            /// Arquilink
            /// </summary>
            Arquilink: 10,
            /// <summary>
            /// Bolsa
            /// </summary>
            StockExchange: 11,
            /// <summary>
            /// Fondos de Inversion
            /// </summary>
            InvestmentFunds: 12,
            /// <summary>
            /// Otros
            /// </summary>
            Others: 13
        };
    }();
    var userProductFamilyGetNameById = function (id) {
        for (var i = 0; i < Object.keys(userProductFamilies).length; i++) {

            var key = Object.keys(userProductFamilies)[i];

            if (userProductFamilies[key] == id) {
                return key;
            }
        }

        return null;
    };

    module("User challenge authentication token");

    test("User request a challenge", function () {

        var user = userGenerate();

        ok(user.DocumentId !== undefined, "User has data");

        P(jQuery.post(baseUrl + "/api/Auth", user))
            .nodeify(function (errChallenge, challenge) {


                if (errChallenge !== null) {
                    ok((errChallenge !== null) === false, "Users challenge error -> " + JSON.stringify(errChallenge));
                }
                else {
                    ok(true, "Users challenge accepted");

                    var formData = {
                        client_id: client_id,
                        grant_type: "password",
                        DocumentId: user.DocumentId,
                        Username: user.UserName,
                        Positions: "00",
                        ChallengeId: challenge.identifier
                    };

                    P(jQuery.post(baseUrl + "/token", formData))
                        .nodeify(function (errAuthorization, authorization) {

                            if (errAuthorization !== null) {
                                ok((errAuthorization !== null) === false, "Authorization fail -> " + JSON.stringify(errAuthorization));
                            }
                            else {
                                ok(authorization.access_token !== "", "User authorization accepted");
                                ok(authorization.token_type === "bearer", "User authorization token type is bearer");
                                ok(authorization.expires_in !== null, "User authorization has expiry timestamp");

                                var authAjaxOptions = {
                                    url: null,
                                    type: "GET",
                                    beforeSend: function (xhr, settings) {
                                        xhr.setRequestHeader("Authorization", "Bearer " + authorization.access_token);
                                    }
                                };


                                authAjaxOptions.url = baseUrl + "/api/user/";

                                P(jQuery
                                    .ajax(authAjaxOptions)).nodeify(function (errUserDetail, userDetail) {

                                        if (errUserDetail !== null) {
                                            ok((errUserDetail !== null) === false, "user detail fail -> " + JSON.stringify(errUserDetail));
                                        }
                                        else {

                                            //console.log(JSON.stringify(errUserDetail));
                                            //console.log(JSON.stringify(userDetail));
                                            //console.log(userDetail);

                                            // search default view
                                            var userDefaultView = null;

                                            for (var i = 0; i < userDetail.views.length; i++) {

                                                var userView = userDetail.views[i];

                                                if (userView.type == userViewTypes.Default) {
                                                    userDefaultView = userView;
                                                }
                                            }

                                            ok(userDefaultView !== null, "user default view exists");

                                            authAjaxOptions.url = baseUrl + "/api/products/" + userDefaultView.id;

                                            P(jQuery
                                                .ajax(authAjaxOptions)).nodeify(function (errViewDetail, userViewDetail) {

                                                    if (errViewDetail !== null) {
                                                        ok((errViewDetail !== null) === false, "user views fail -> " + JSON.stringify(errViewDetail));
                                                    }
                                                    else {


                                                        var groupedArray = {};

                                                        for (var j = 0; j < userViewDetail.length; j++) {

                                                            var product = userViewDetail[j];

                                                            if (groupedArray[product.family] === undefined) {
                                                                groupedArray[product.family] = [];
                                                            }

                                                            groupedArray[product.family].push(product);

                                                        }


                                                        for (var k = 0; k < Object.keys(groupedArray).length; k++) {

                                                            var familyKey = Object.keys(groupedArray)[k];
                                                            var familyName = userProductFamilyGetNameById(familyKey);
                                                            console.log("\n" + familyName + " (" + groupedArray[familyKey].length + ") ");

                                                            for (var l = 0; l < groupedArray[familyKey].length; l++) {

                                                                var productDetail = groupedArray[familyKey][l];

                                                                console.log("\n\t" + productDetail.description + " -> " + productDetail.numProd);

                                                            }
                                                        }



                                                    }
                                                });


















                                        }
                                    });
                            }

                        });
                }

            });
    });

})(QUnit, P);