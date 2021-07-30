let express = require('express'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  database = require('./database'),
  bodyParser = require('body-parser');

  // Connect to the mongoDb
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected")
  })
  .catch(error => {
    console.error("Couldn't connect to databse: ", error)
  })

  //initialize app
const userAPI = require('./routes/user.route')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

// API
app.use('/api', userAPI)

app.get('/', (req, res) =>{
  return res.send("<h1>Hello World<h1>");
})

// Create port
const port = process.env.port || 4000;
const server = app.listen(port, () => {
  console.log("Connected to port ", port)
})

// Find 404
app.use((req, res, next) => {
  next(createError(404));
})

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});