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

//API
app.use('/api/users', userAPI);



// Create port
const port = process.env.port || 4000;
const server = app.listen(port, () => {
  console.log("Connected to port ", port)
})
