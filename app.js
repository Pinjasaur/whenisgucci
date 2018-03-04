require("dotenv").config();

// NPM modules
const express      = require("express");
const nunjucks     = require("nunjucks");
const bodyParser   = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose     = require("mongoose");

// Stdlib modules
const path = require("path");

// Routes
const index = require("./routes/index");
const test  = require("./routes/test");

// Setup MongoDB connection
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("open",  console.log.bind(console, "MongoDB connected."));

// Variables
const app = express();

// Configure Express to use Nunjucks for templating
nunjucks.configure("views", {
  autoescape: true,
  express: app
});

// Nunjucks uses .njk extensions
app.set("view engine", "njk");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(index);
app.use(test);

// Handles 404s
app.use((req, res, next) => {
  res
    .status(404)
    .render("404");
});

// Serve on :8080
app.listen(8080);
