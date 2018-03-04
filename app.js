// NPM modules
const express      = require("express");
const nunjucks     = require("nunjucks");
const bodyParser   = require("body-parser");
const cookieParser = require("cookie-parser");

// Stdlib modules
const path = require("path");

// Routes
const index = require("./routes/index");

// Variables
const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

app.set("view engine", "njk");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(index);

// Handles 404s
app.use((req, res, next) => {
  res
    .status(404)
    .render("404");
});

// Serve on :8080
app.listen(8080);
