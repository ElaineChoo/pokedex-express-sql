const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');
const { Client } = require('pg');

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set handlebars to be the default view engine
app.engine('handlebars', exphbs.create().engine);
app.set('view engine', 'handlebars');


/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', (request, response) => {
    // Initialise postgres client
    const client = new Client({
        user: 'postgres',
        password: '13Dec1985',
        host: '127.0.0.1',
        database: 'pokemons',
        port: 5432
    });
    // query database for all pokemon
    client.connect((err) => {
        if (err) {
            console.log('error', err.message);
        }

        let context = {
            pokemon: []
        };
        let text = 'SELECT name from pokemon ORDER BY id ASC';

        client.query(text, (err, result) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                context.pokemon = result.rows;
                // respond with HTML page displaying all pokemon
                response.render('home', context);
            }
            client.end();
        });
    });
});

app.get('/new', (request, response) => {

    // respond with HTML page with form to create new pokemon
    response.render('new');
});

app.post('/', (request, response) => {
    // Initialise postgres client
    const client = new Client({
        user: 'postgres',
        password: '13Dec1985',
        host: '127.0.0.1',
        database: 'pokemons',
        port: 5432
    });
    let text = 'INSERT INTO pokemon (num, name, img, weight, height) VALUES ($1, $2, $3, $4, $5)';
    let value = [request.body.num, request.body.name, request.body.img, request.body.weight, request.body.height];
    client.connect((err) => {
        if (err) console.error('connection error:', err.stack);
        client.query(text, value, (err, result) => {
            if (err) {
                console.error('query error:', err.stack);
            } else {
                console.log('query result:', result);
                // redirect to home page
                response.redirect('/');
            }
            client.end();
        });
    });
});

app.get('/:id', (request, response) => {
    // Initialise postgres client
    const client = new Client({
        user: 'postgres',
        password: '13Dec1985',
        host: '127.0.0.1',
        database: 'pokemons',
        port: 5432
    });
    // query database for all pokemon
    client.connect((err) => {
        if (err) {
            console.log('error', err.message);
        }

        let context = {
            pokemon: []
        };
        let inputId = parseInt(request.params.id);
        let text = "SELECT * from pokemon WHERE id = " + inputId;

        client.query(text, (err, result) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                context.pokemon = result.rows[0];
                // respond with HTML page displaying all pokemon
                response.render('pokemon', context);
            }
            client.end();
        });
    });
});

app.get('/:id/edit', (request, response) => {
    // Initialise postgres client
    const client = new Client({
        user: 'postgres',
        password: '13Dec1985',
        host: '127.0.0.1',
        database: 'pokemons',
        port: 5432
    });
    // query database for all pokemon
    client.connect((err) => {
        if (err) {
            console.log('error', err.message);
        }
        let inputId = request.params.id;
        let text = "SELECT * from pokemon WHERE id = " + inputId;

        client.query(text, (err, result) => {
            if (err) {
                console.error('query error:', err.stack);
            } else {

                let context = {
                    pokemon: []
                };
                context.pokemon = result.rows[0];
                console.log('results', result.rows[0]);
                response.render('edit', context);
            }
            client.end();
        });
    });
});

app.put('/:id', (request, response) => {
    // Initialise postgres client
    const client = new Client({
        user: 'postgres',
        password: '13Dec1985',
        host: '127.0.0.1',
        database: 'pokemons',
        port: 5432
    });
    // query database for all pokemon
    client.connect((err) => {
        if (err) {
            console.log('error', err.message);
        }
        let inputId = request.params.id;
        let param = request.body;
        let text = "UPDATE pokemon SET num = $1, name = $2, img = $3, weight = $4, height = $5 WHERE id = " + inputId;
        let values = [param.num, param.name, param.img, param.weight, param.height];

        client.query(text, values, (err, result) => {
            if (err) {
                console.error('query error:', err.stack);
            } else {

                let text1 = "SELECT * from pokemon WHERE id = " + inputId + "ORDER BY id ASC";
                let context = {
                    pokemon: []
                }

                client.query(text1, (err, result) => {
                    if (err) {
                        console.log("query error", err.message);
                    } else {
                        context.pokemon = result.rows[0];
                        // respond with HTML page displaying all pokemon
                        response.render('pokemon', context);
                        client.end();
                    }
                });
            }
        });
    });
});

app.delete('/:id', (request, response) => {
    // Initialise postgres client
    const client = new Client({
        user: 'postgres',
        password: '13Dec1985',
        host: '127.0.0.1',
        database: 'pokemons',
        port: 5432
    });
    let inputId = request.params.id;
    let text = "DELETE from pokemon WHERE id = " + inputId;

    client.connect((err) => {
        if (err) console.error('connection error:', err.stack);
        client.query(text, (err, result) => {
            if (err) {
                console.error('query error:', err.stack);
            } else {
                console.log('query result:', result);
                // redirect to home page
                response.redirect('/');
            }
            client.end();
        });
    });
});

app.post('/pokemon', (request, response) => {
    // Initialise postgres client
    const client = new Client({
        user: 'postgres',
        password: '13Dec1985',
        host: '127.0.0.1',
        database: 'pokemons',
        port: 5432
    });

    let params = request.body;
    const queryString = 'INSERT INTO pokemon (name, height) VALUES($1, $2)';
    const values = [params.name, params.height];

    client.connect((err) => {
        if (err) console.error('connection error:', err.stack);

        client.query(queryString, values, (err, result) => {
            if (err) {
                console.error('query error:', err.stack);
            } else {
                console.log('query result:', result);

                // redirect to home page
                response.redirect('/');
            }
            client.end();
        });
    });
});



/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));