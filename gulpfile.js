// [Load gulp plugins]
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify')
	minifyJSON = require('gulp-jsonminify'),
	minifyHTML = require('gulp-minify-html');

//Declare variables
var env,
	jsSrc,
	dataSrc,
	htmlSrc,
	outputDir;

//Create environment variable
env = process.env.NODE_ENV || 'dev';

if (env === 'dev') { //If env = def, we are in dev mode
	outputDir = 'builds/dev/'
} else { // Otherwise, we are in production mode
	outputDir = 'builds/production/'
}

// [Define sources]
jsSrc = ['components/scripts/*.js', 'components/scripts/**/*.js'];
dataSrc = ['componenets/data/*.json'];
htmlSrc = ['builds/dev/*.html'];
viewsSrc = ['builds/dev/views/*.html'];
cssSrc = ['builds/dev/css/*.css'];

// [Gulp tasks]

//Process HTML
gulp.task('html', function() {
	gulp.src(htmlSrc)
		.pipe(gulpif(env === 'production', minifyHTML()))  //If in production, minify...
		.pipe(gulp.dest(outputDir))  //Place in output dir
		.pipe(connect.reload())  //Reload page to reflect changes
});

//Process views
gulp.task('views', function() {
	gulp.src(viewsSrc)
		.pipe(gulpif(env === 'production', minifyHTML()))  //If in production, minify...
		.pipe(gulp.dest(outputDir + '/views'))  //Place in production folder
		.pipe(connect.reload())  //Reload page to reflect changes
});

//Process JSON data
gulp.task('json', function() {
	gulp.src(dataSrc)
		.pipe(gulpif(env === 'production', minifyJSON()))  //If in production, minify
		.pipe(gulp.dest(outputDir + '/js/data'))  //Place in output dir
		.pipe(connect.reload())
});

//Process JavaScript
gulp.task('js', function() {
	gulp.src(jsSrc)
		.pipe(concat('script.js'))  //Combine all scripts into script.js
		.pipe(browserify())  //Inject required technologies
		.pipe(gulpif(env === 'production', uglify()))  //Minify JavaScript
		.pipe(gulp.dest(outputDir + '/js'))  //Place in ouput dir
		.pipe(connect.reload())  //Reload page to reflect changes
});

gulp.task('css', function() {
	gulp.src(cssSrc)
		.pipe(gulp.dest(outputDir + '/css'))  //Place in output dir
		.pipe(connect.reload())  //Reload page to reflect changes
});


//Watch for any changes, update when dedected
gulp.task('watch', function() {
	gulp.watch(jsSrc, ['js']);
	gulp.watch(htmlSrc, ['html']);
	gulp.watch(dataSrc, ['json']);
	gulp.watch(viewsSrc, ['views']);
	gulp.watch(cssSrc, ['css']);
});

//Connect task for livereload server
gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

//Declare default task
gulp.task('default', ['html', 'views', 'css', 'json', 'js', 'connect', 'watch']);