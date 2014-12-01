(function () {
    
    'use strict';
    
    /*
    * Modified from https://github.com/elliotf/mocha-mongoose
    */

    var db = require('../../../src/libs/db');
    var config = require('../../../src/libs/config');
    var mongoose = require('mongoose');
    
    // ensure the NODE_ENV is set to 'test'
    // this is helpful when you would like to change behavior when testing
    process.env.NODE_ENV = 'test';
    
    before(function () {
    
    });

    after(function () {
        
    });

    beforeEach(function (done) {
        
        function clearDB() {
            
            mongoose.connection.db.dropDatabase(function (err, result) { 

                return done();
            
            });

            //for (var i in mongoose.connection.collections) {
                
            //    console.log("DATABASE !!!!!!");
            //    console.log(mongoose.connection.collections[i]);

            //    mongoose.connection.collections[i].remove(function () { });
            //}
            //return done();
        }
        
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(config.get('mongoose:uri'), function (err) {
                if (err) {
                    throw err;
                }
                return clearDB();
            });
        } else {
            return clearDB();
        }
    });
    
    afterEach(function (done) {
        mongoose.disconnect();
        return done();
    });

})();












//UserModel.remove({}, function (err) {
    
//    var user = new UserModel({ username: "andrey", password: "simplepassword" });
    
//    user.save(function (err, user) {
//        if (err) return log.error(err);
//        else log.info("New user - %s:%s", user.username, user.password);
//    });
    
//    for (i = 0; i < 4; i++) {
//        var user = new UserModel({ username: faker.name.firstName().toLowerCase(), password: faker.lorem.words(1)[0] });
//        user.save(function (err, user) {
//            if (err) return log.error(err);
//            else log.info("New user - %s:%s", user.username, user.password);
//        });
//    }
//});

//ClientModel.remove({}, function (err) {
//    var client = new ClientModel({ name: "OurService iOS client v1", clientId: "mobileV1", clientSecret: "abc123456" });
//    client.save(function (err, client) {
//        if (err) return log.error(err);
//        else log.info("New client - %s:%s", client.clientId, client.clientSecret);
//    });
//});

//AccessTokenModel.remove({}, function (err) {
//    if (err) return log.error(err);
//});

//RefreshTokenModel.remove({}, function (err) {
//    if (err) return log.error(err);
//});































