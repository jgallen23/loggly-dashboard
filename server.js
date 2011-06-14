var express = require('express'),
    path = require('path'),
    stylus = require('stylus');

var app = express.createServer();
var port = 80;
var winston = require('winston');
var loggly = require('loggly');

if (path.existsSync("config.js")) {
  var config = require('./config');
  for (var subdomain in config) {
    config[subdomain].log = loggly.createClient({ subdomain: subdomain, auth: config[subdomain].auth });
  }
}


var useCache = false;
var cache = {};

var ui = function(req, res, next) {
  res.local('scripts', []);
  res.local('stylesheets', []);
  res.local('pageTitle', '');
  next();
};

app.configure(function() {
  app.use(ui);
  app.use(app.router);
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.helpers({
    inProduction: (process.env.NODE_ENV === 'production')
  });
  app.set('views', '' + __dirname + '/templates');
  app.set('view options', {
    layout: 'layouts/basic'
  });
  app.set('view engine', 'jade');

  var stylusCompile = function(str, path) {
    return stylus(str).set('filename', path).set('compress', true);
  };

  app.use('/ui', stylus.middleware({
    src: __dirname + '/public/ui',
    dest: __dirname + '/public/ui',
    compile: stylusCompile
  }));

  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function() {
  port = 3000;
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});
app.configure('production', function() {
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.render('index', {
    config: config
  });
});

app.get('/:subdomain', function(req, res) {
  var subdomain = req.params.subdomain;
  var site = config[subdomain];
  res.render('dashboard', {
    subdomain: subdomain,
    widgets: site.widgets
  });
});

app.get('/:subdomain/api/:name', function(req, res) {
  var subdomain = req.params.subdomain;
  var name = req.params.name;
  var site = config[subdomain];
  var widget = site.widgets[name];
  res.contentType('application/json');
  if (useCache && cache[name]) {
    res.send(cache[name]);
  } else {
    if (widget.type == 'facet') {
      site.log.facet(widget.facet, widget.query)
        .context(widget.context)
        .run(function(err, results) {
          var data = [];
          for (var date in results.data) {
            data.push({
              timestamp: new Date(date).getTime(),
              count: results.data[date]
            });
          }
          results.data = data;
          cache[name] = results;
          res.send(results);
        });
    } else if (widget.type == 'search') {
      site.log.search(widget.query)
        .context(widget.context)
        .run(function(err, results) {
          if (widget.regex) {
            for (var i = 0, c = results.data.length; i < c; i++) {
              var result = results.data[i];
              result.timestamp = new Date(result.timestamp).getTime();
              result.output = result.text.match(widget.regex)[1];
            }
          }
          cache[name] = results;
          res.send(results);
        });
    }
  }
});


app.listen(port, '0.0.0.0');
