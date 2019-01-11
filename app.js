const express = require('express');
const PORT = process.env.PORT || 5002;
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/scripts')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
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
app.listen(PORT, () => console.log(`Currently listening on ${ PORT }`));

const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

client.connect();