const express = require("express");
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');

const logger = require('./util/logger');
const requestLogger = require('./middleware/requestLogger')
const authenticate = require('./middleware/authenticate');

// Import routes
const home = require('./routes/home');
const courses = require('./routes/courses');

const app = express();

// Invoke express.json() middleware to parse the request and populate request.body
app.use(express.json());

// Invoke mddleware to parse key=value pairs to request.body
app.use(express.urlencoded({extended: true}));

// Invoke middleware to set static folder
app.use(express.static('public'));

app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

// Invoke self-defind middleware functions in sequence and pass the request to next state
app.use(requestLogger);
app.use(authenticate);

// route all requests to specific router based on end points 
app.use('/', home);
app.use('/api/courses', courses);

logger.info('Mail Host: ', config.get('email.host'))
logger.debug('Mail Host: ', config.get('email.password'))


// Start up the service and listen to a given port
const port = config.get('port') || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
