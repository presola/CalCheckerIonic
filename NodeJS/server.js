var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var rest    = require('restler');
var crypto  = require('crypto');
var parser = require('xml2json');

var fatSecretRestUrl = 'http://platform.fatsecret.com/rest/server.api';
var apiKey           = '';
var sharedSecret     = '';

//CORS Middleware, causes Express to allow Cross-Origin Requests
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(allowCrossDomain);


// Close the database connection and server when the application ends
process.on('SIGTERM', function() {
    console.log("Shutting server down.");
    app.close();
});

if (apiKey == '' || sharedSecret == '') {
  console.log("Please input your api and shared secret gotten from Fat Secret")
}
else{
  var server = app.listen(4551, function() {
    console.log('Listening on port %d', server.address().port);
  });
}

// Creates a new bmi in the database
app.post('/food', function(req, res) {

    var searchtext = req.body;
    var search = searchtext.search;
    var method = 'foods.search';
    var options = getRequest(search, method);

    rest.post(fatSecretRestUrl, {
        data: options,
    }).on('complete', function(data, response) {
        var xml = response;

        var json = JSON.parse(parser.toJson(xml.rawEncoded));

        return res.json(200, json.foods);

    });

});

// Creates a new bmi in the database
app.post('/recipes', function(req, res) {

    var searchtext = req.body;
    var search = searchtext.search;
    var method = 'recipes.search';
    var options = getRequest(search, method);
// Launch!
    rest.post(fatSecretRestUrl, {
        data: options,
    }).on('complete', function(data, response) {
        var xml = response;

        var json = JSON.parse(parser.toJson(xml.rawEncoded));
        return res.json(200, json.recipes);
    });

});

// Creates a new bmi in the database
app.post('/recipe', function(req, res) {

    var searchtext = req.body;
    var search = searchtext.search;
    var method = 'recipe.get';
    var options = getRequest(search, method);

    rest.post(fatSecretRestUrl, {
        data: options,
    }).on('complete', function(data, response) {
        var xml = response;

        var json = JSON.parse(parser.toJson(xml.rawEncoded));
        return res.json(200, json.recipe);
    });

});


function getRequest(search, method){

    var timestamp = Math.floor(new Date().getTime()/1000);
    var nonce = Math.random().toString(36).replace(/[^a-z]/, '').substr(2);


// Note that the keys are in alphabetical order
    var options = {
        method: method,
        oauth_consumer_key: apiKey,
        oauth_nonce: nonce,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: timestamp,
        oauth_version: '1.0'

    };
    if (method === 'foods.search')
    {
        options.search_expression = search
    }
    else if (method === 'recipes.search')
    {
        options.search_expression = search
    }
    else if (method === 'recipe.get')
    {
        options.recipe_id = search
    }
// construct a param=value& string and uriEncode
    var paramsStr = '';
    for (var i in options) {
        paramsStr += "&" + i + "=" + options[i];
    }

// yank off that first "&"
    paramsStr = paramsStr.substr(1);

    var sigBaseStr = "POST&"
        + encodeURIComponent(fatSecretRestUrl)
        + "&"
        + encodeURIComponent(paramsStr);

// no  Access Token token (there's no user .. we're just calling foods.search)
    sharedSecret += "&";

    var hashedBaseStr  = crypto.createHmac('sha1', sharedSecret).update(sigBaseStr).digest('base64');

    options.oauth_signature = hashedBaseStr;
    return options
}
