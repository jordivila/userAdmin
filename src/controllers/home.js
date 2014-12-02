    module.exports = function (app) {
    
    app.get('/', function (req, res, next) {
        res.sendFile('public/index.html', { root: __dirname });
    });
  
};

