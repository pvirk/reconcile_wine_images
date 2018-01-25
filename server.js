// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
const process_product = require('./process_product.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/', function (req, res) {
  console.log(req.body);
  res.json({ message: 'Processed associated_entity_id: ' +  req.body.associated_entity_id, 
  			 associated_entity_id: req.body.associated_entity_id});
  process_product.processProductchecks({associated_entity_id: req.body.associated_entity_id});
})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke while processing body.associated_entity_id: ' + req.body.associated_entity_id)
})


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);