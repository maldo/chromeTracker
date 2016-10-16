const express = require('express');
const bodyParser = require('body-parser')

const app = express();

/*
 * Used as middleware for logging the date,
 * in production winston should be used
 */
let customLogger = function (req, res, next) {
	console.log('LOGGED - ' + new Date());
	next();
};

app.use(customLogger);

// Body json parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.post('/', function (req, res) {
	console.dir(req.body);
	res.sendStatus(200);
});

app.listen(3000, function () {
	console.log('... port %d in %s mode', app.get('port'), app.settings.env);
});