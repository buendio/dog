var gulp = require('gulp');
var rename = require('gulp-rename'),
	prefix = require('gulp-autoprefixer');
	var sass = require('gulp-sass')(require('sass'));

gulp.task('sass', async function() {
	gulp.src(['sass/*.sass','sass/*.scss'])
		.pipe(sass())
		.pipe(prefix('last 15 version'))
		.pipe(gulp.dest('assets'));
})

gulp.task('watch', function () {
	gulp.watch(['sass/*.sass','sass/*.scss'], gulp.series('sass'));
});