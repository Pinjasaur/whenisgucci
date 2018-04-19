// NPM modules
const express      = require("express");
const nunjucks     = require("nunjucks");
const bodyParser   = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose     = require("mongoose");
const dotenv       = require("dotenv");

// Stdlib modules
const path = require("path");
const fs   = require("fs");

// Load in .env
dotenv.config();

const isProduction = (process.env.NODE_ENV === "production") ? true : false;

// Override env for production
if (isProduction) {
  const env = dotenv.parse(fs.readFileSync(".env-prod"));
  for (var key in env) {
    process.env[key] = env[key];
  }
}

// Setup MongoDB connection
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", () => console.error("MongoDB connection error:"));
db.on("open", () => console.log("MongoDB connected."));

// Variables
const app = express();

// Configure Express to use Nunjucks for templating
nunjucks.configure("views", {
  autoescape: true,
  express: app,
  noCache: !isProduction
});

// Nunjucks uses .njk extensions
app.set("view engine", "njk");

// Disable X-Powered-By header in production
if (isProduction)
  app.disable("x-powered-by");

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

// Routes (Auth)
app.use(require("./routes/auth/index"));

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
