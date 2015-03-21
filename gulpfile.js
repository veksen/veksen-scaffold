var gulp       = require('gulp');
var sass       = require('gulp-sass');
var mincss     = require('gulp-minify-css');
var notify     = require('gulp-notify');
var gutil      = require('gulp-util');
var rev        = require('gulp-rev');
var bower      = require('gulp-bower');
var smap       = require('gulp-sourcemaps');
var autoprefix = require('gulp-autoprefixer');;

var paths = {
	sass:  './src/scss',
	css:   './dist/css',
	fonts: './dist/fonts',
	bower: './bower_components'
}

gulp.task('watch', function () {
	gulp.watch(paths.sass + '/**/*.scss', ['sass']);
});

gulp.task('default', ['bower', 'fa', 'assets', 'sass']);

gulp.task('bower', function() {
	return bower()
		.pipe(gulp.dest(paths.bower));
});

gulp.task('fa', function() {
	return gulp.src(paths.bower + '/fontawesome/fonts/**.*')
		.pipe(gulp.dest(paths.fonts));
});

gulp.task('assets', function() {
	return gulp.src(paths.sass + '/assets.scss')
		.pipe(smap.init())
		.pipe(notify({
			message: "Generated file <%= file.relative %>",
		}))
		.pipe(sass({
			style: 'compressed',
			includePaths: [
				paths.sass,
				paths.bower + '/foundation/scss',
				paths.bower + '/fontawesome/scss',
			]
		}))
		.pipe(mincss())
		.on('error', notify.onError(function(error) {
			return "Error: " + error.message;
		}))
		.pipe(smap.write())
		.pipe(gulp.dest(paths.css + '/assets'));
})

gulp.task('sass', function() {
	return gulp.src(paths.sass + '/main.scss')
		.pipe(notify({
			message: "Generated file <%= file.relative %>",
		}))
		.pipe(sass({
			style: 'compressed'
		}))
		.pipe(autoprefix())
		.pipe(mincss())
		//.pipe(rev())
		.on('error', notify.onError(function(error) {
			return "Error: " + error.message;
		}))
		.pipe(gulp.dest(paths.css));
});
