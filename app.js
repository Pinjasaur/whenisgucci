require("dotenv").config();

// NPM modules
const express      = require("express");
const nunjucks     = require("nunjucks");
const bodyParser   = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose     = require("mongoose");

// Stdlib modules
const path = require("path");

// Setup MongoDB connection
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", () => console.error("MongoDB connection error:"));
db.on("open", () => console.log("MongoDB connected."));

// Variables
const app = express();
const isProduction = (process.env.NODE_ENV === "production") ? true : false;

// Configure Express to use Nunjucks for templating
nunjucks.configure("views", {
  autoescape: true,
  express: app,
  noCache: !isProduction
});

// Nunjucks uses .njk extensions
app.set("view engine", "njk");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// Routes (Pages)
app.use(require("./routes/index"));
app.use(require("./routes/event/results"));
app.use(require("./routes/event/respond"));
// app.use(require("./routes/test"));
app.use(require("./routes/create"));

// Routes (API Endpoints)
app.use(require("./routes/api/event/create"));
app.use(require("./routes/api/event/respond"));
app.use(require("./routes/api/event/verify-code"));
app.use(require("./routes/api/event/index"));

// Handles 404s
app.use((req, res, next) => {
  res
    .status(404)
    .render("404");
});

// Handles Errors
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({
      status: false,
      messages: [ `${err.name}: ${err.message}` ],
      result: {}
    });
});

// Serve on :8080
app.listen(8080);
