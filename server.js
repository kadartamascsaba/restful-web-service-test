
var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require("fs");
var app        = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.use(function (req, res, next) {
	next();
});

router.get('/', function(req, res) {
	res.json({ message: 'Welcome to my api!' });	
});

router.route('/users')

	// get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function (req, res) {
		fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
			if (err) {
				res.send(err);
			} else {
				data = JSON.parse(data);
				res.json(data);
			};
		});
	});

// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

	// get the user with that id
	.get(function (req, res) {
		fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
			if (err) {
				res.send(err);
			} else {
				data = JSON.parse(data);
				user = data[req.params.user_id];
				res.json(user);
			};
		});
	})

	// create a user
	.put(function (req, res) {

		var user = req.body;
		var users = JSON.parse(fs.readFileSync(__dirname + "/" + "users.json", 'utf8'));
		
		if(users.hasOwnProperty(req.params.user_id)) {
			res.json({ message: 'This user exist!' });
			return;
		}

		users[req.params.user_id] = user;

		fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users), function (err) {
			if(err) {
				res.send(err);
			}
			else {
				res.json({ message: 'User created!' });
			};
		});
		
	})

	// update the user with id
	.post(function (req, res) {
		var user = req.body;
		var users = JSON.parse(fs.readFileSync(__dirname + "/" + "users.json", 'utf8'));
		
		users[req.params.user_id] = user;

		fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users), function (err) {
			if(err) {
				res.send(err);
			}
			else {
				res.json({ message: 'User updated!' });
			};
		});
	})

	// delete the user with id
	.delete(function (req, res) {

		var users = JSON.parse(fs.readFileSync(__dirname + "/" + "users.json", 'utf8'));

		delete users[req.params.user_id];

		fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users), function (err) {
			if(err) {
				res.send(err);
			}
			else {
				res.json({ message: 'Delete finshed!' });
			};
		});
		
	});

app.use('/api', router);

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/" + 'index.html');
});

app.get('/index.html', function (req, res) {
	res.sendFile(__dirname + "/" + 'index.html');
});

app.get('/jquery-1.11.3.min.js', function (req, res) {
	res.sendFile(__dirname + "/" + 'jquery-1.11.3.min.js');
});

app.listen(port);
console.log('Magic happens on port ' + port);
