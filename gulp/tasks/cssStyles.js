'use strict';

import config       from '../config';
import gulp         from 'gulp';
import gulpif       from 'gulp-if';
import sourcemaps   from 'gulp-sourcemaps';
import sass         from 'gulp-sass';
import handleErrors from '../util/handleErrors';
import browserSync  from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';

gulp.task('cssStyles', function () {

  const createSourcemap = !global.isProd || config.cssStyles.prodSourcemap;

  return gulp.src(config.cssStyles.src)
    .pipe(gulp.dest(config.cssStyles.dest))
    .pipe(browserSync.stream());

});
