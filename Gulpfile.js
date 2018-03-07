const gulp    = require("gulp"),
      plugins = require("gulp-load-plugins")(),
      server  = require("browser-sync").create(),
      pkg     = require("./package.json"),
      production = (
                    process.env.NODE_ENV === "production" ||
                    plugins.util.env.prod ||
                    plugins.util.env.production
                   ) ?
                    true :
                    false,
      config  = {
        autoprefixer: {
          browsers: ["last 2 versions"]
        },
        browserSync: {
          proxy: {
            target: "http://localhost:8080/",
          },
          notify: false,
          // Create a tunnel (if using `--tunnel`) with a subdomain of:
          // 1. the first "chunk" of the package.json `name`
          // 2. a random 6-character string appended to it
          // Note: needs to be lowercased alphanumerics
          tunnel: plugins.util.env.tunnel ?
                  (pkg.name.trim().toLowerCase().split(/[^a-zA-Z0-9]/g)[0] + // [1]
                  Math.random().toString(36).substr(2, 6)) :                 // [2]
                  false,
        },
        csso: {
          comments: false
        },
        imagemin: {
          verbose: true
        },
        sass: {
          outputStyle: (production) ? "compressed" : "expanded"
        }
};

// Build the Sass
gulp.task("build:sass", () => {
  return gulp
  .src("assets/sass/*.scss")
  .pipe(plugins.plumber())
  .pipe(plugins.if(!production, plugins.sourcemaps.init()))
  .pipe(plugins.sass.sync(config.sass))
  .pipe(plugins.autoprefixer(config.autoprefixer))
  .pipe(plugins.if(!production, plugins.sourcemaps.write(".")))
  .pipe(plugins.if(production, plugins.csso(config.csso)))
  .pipe(gulp.dest("public/css"))
  .pipe(server.stream({ match: "**/*.css" }));
});

// Build the JS
gulp.task("build:js", () => {
  return gulp
  .src("assets/js/*.js")
  .pipe(plugins.if(production, plugins.uglify()))
  .pipe(gulp.dest("public/js"));
});

// Wrapper task to watch JS, build, and reload
gulp.task("watch:js", ["build:js"], () => {
  server.reload();
});

// Build images
gulp.task("build:img", () => {
  return gulp
  .src("assets/img/**/*.+(jpg|jpeg|gif|png|svg)")
  .pipe(plugins.imagemin(config.imagemin))
  .pipe(gulp.dest("public/img"));
});

// Wrapper task to watch images, build, and reload
gulp.task("watch:img", ["build:img"], () => {
  server.reload();
});

// Build
gulp.task("build", ["build:sass", "build:js", "build:img"]);

// Spin up server
gulp.task("server", ["nodemon", "build"], done => {
  server.init(config.browserSync, done);
});

// Use nodemon to watch for server changes
gulp.task("nodemon", done => {
  let started = false;

  return plugins.nodemon({
    script: "app.js"
  }).on("start", () => {
    // Avoid nodemon being started multiple times
    if (!started) {
      done();
      started = true;
    }
  });
});

// Serve content and watch for changes
gulp.task("serve", ["server"], () => {
  gulp.watch("assets/sass/**/*.scss", ["build:sass"]);
  gulp.watch("assets/js/**",          ["watch:js"]);
  gulp.watch("assets/img/**",         ["watch:img"]);
  gulp.watch("views/**",              server.reload);
  gulp.watch("{,routes/}*.js",        server.reload);
});

// Delete built files/directories
gulp.task("clean", () => {
  return gulp
  .src("public", { read: false })
  .pipe(plugins.clean({ force: true }));
});

gulp.task("default", ["serve"]);
