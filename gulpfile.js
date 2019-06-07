const {series, dest, parallel} = require("gulp");
let ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconfig.json");
let tsProjectProd = ts.createProject("tsconfig.prod.json");
var source = require('vinyl-source-stream');
let browserify = require("browserify");
var buffer = require("vinyl-buffer");
var uglify = require("gulp-uglifyes");

function tsc() {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(dest('.'))
    .once("error", function () {
      this.once("finish", function () {
        process.exit(1);
      });
    });
}

function tscProd() {
  return tsProjectProd.src()
    .pipe(tsProjectProd())
    .pipe(dest("dist"))
    .once("error", function () {
      this.once("finish", function () {
        process.exit(1);
      });
    });
}

function bundleMin() {
  return browserify({
    standalone: "DIC"
  })
    .add("index.ts")
    .plugin("tsify")
    .bundle()
    .pipe(source("dependencyjs.min.js"))
    .pipe(buffer())
    .pipe(uglify({
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
      }
    }))
    .pipe(dest("dist"));
}

function bundle() {
  return browserify({
    standalone: "DIC"
  })
    .add("index.ts")
    .plugin("tsify")
    .bundle()
    .pipe(source("dependencyjs.js"))
    .pipe(dest("dist"));
}

exports.build = parallel(tscProd, bundle, bundleMin);
exports.tsc = tsc;