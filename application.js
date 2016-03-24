global.__base = __dirname + '/';

var mbaasApi = require('fh-mbaas-api'),
    express = require('express'),
    mbaasExpress = mbaasApi.mbaasExpress(),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    Logger = require('fh-logger-helper'),

    securableEndpoints;

// list the endpoints which you want to make securable here
securableEndpoints = [];

var app = express();

// Enable CORS for all requests
app.use(cors());
app.use(bodyParser());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/', require(__base + 'lib/signupPage')());
app.use('/slackbot', require(__base + 'lib/slackbot')());

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
    Logger.info("App started on port", port);
});