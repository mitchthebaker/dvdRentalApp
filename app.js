const express = require('express');
const PORT = process.env.PORT || 5002;
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost/simpletest', { useNewUrlParser: true });
mongoose.connect('mongodb://mbaker:OMGnoway23@ds155294.mlab.com:55294/dvdrentalapp', {useNewUrlParser: true});

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	name: String
});
var User = mongoose.model('User', UserSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/scripts')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.get('/user/:id', (req, res) => {
	User.findById(req.params.id)
	.then(doc => {
		if(!doc) {
			return res.status(404).end();
		}
		else {
			return res.status(200).json(doc);
		}
	})
	.catch(err => next(err));
});
app.get('/user', (req, res) => {
	User.find({}, (err, users) => {
		if(err) {
			res.send('Something went wrong here..');
			next();
		} 
		else {
			res.json(users);
		}
	});
})
app.post('/user', (req, res) => {
	var user = new User(req.body);
	console.log(user);

	user.save(function(err, user) {
		res.json(user);
	});
});
app.put('/user/:id', (req, res) => {
	var conditions = { _id: req.params.id };

	User.update(conditions, req.body)
	.then(doc => {
		if(!doc) {
			return res.status(404).end();
		}
		else {
			return res.status(200).json(doc);
		}
	})
	.catch(err => next(err));
});
app.delete('/user/:id', (req,res) => {
	User
	.findByIdAndRemove(req.params.id)
	.exec()
	.then(doc => {
		if(!doc) {
			return res.status(404).end();
		} 
		else {
			res.status(204).end();
		}
	})
	.catch(err => next(err));
});
app.get('/db', async (req, res) => {
	try {
		const client = await pool.connect();
		const addQuery = await client.query("INSERT INTO card_list VALUES (2, 'aye', 'whats good')");
		console.log(addQuery);
		const result = await client.query('SELECT * FROM card_list');
  		const results = {
  			'results': (result) ? result.rows : null
  		};

  		res.render('pages/db', results);
  		client.release();
	} 
	catch(err) {
		console.error(err);
  		res.send("Current error: " + err);
	}
});
app.listen(PORT, () => console.log(`Currently listening on port ${ PORT }`));

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

