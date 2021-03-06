var fs = require('fs');
var gulp = require('gulp');
var util = require('gulp-util');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var webpack = require('webpack-stream');
var sizereport = require('gulp-sizereport');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var getVersion = function() {
    return JSON.parse(fs.readFileSync('./package.json').toString()).version;
};

var compile = function(extend) {
    var options = {
        module: {
            preLoaders: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'eslint-loader'
            }],
            loaders: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?optional[]=runtime&stage=0'
            }]
        }
    };

    Object.assign(options, extend);
    var watch = extend.watch;

    return webpack(options, null, function(err, stats) {
        if (err) throw new util.PluginError('webpack', err);

        util.log('[webpack]', stats.toString({
            colors: util.colors.supportsColor,
            chunks: false,
            hash: false,
            version: false
        }));

        browserSync.reload();

        if (watch) {
            watch = false;
            options.done();
        }
    });
};

gulp.task('scripts:build', function(done) {
    return gulp.src('test/scripts/index.js')
        .pipe(compile({
            watch: true,
            done: done,
            devtool: 'inline-source-map',
            output: {
                filename: 'app.js'
            }
        }))
        .pipe(replace(/<%= version %>/, getVersion()))
        .pipe(gulp.dest('build/'));
});

gulp.task('scripts:dist', function() {
    return gulp.src('src/index.js')
        .pipe(compile({
            output: {
                filename: 'smooth-scrollbar.js',
                library: 'Scrollbar',
                libraryTarget: 'umd'
            }
        }))
        .pipe(replace(/<%= version %>/, getVersion()))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('styles:build', function() {
    return gulp.src('test/styles/index.styl')
        .pipe(stylus())
        .pipe(autoprefixer('> 1%, last 2 versions, Firefox ESR, Opera 12.1, ie >= 10'))
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.stream());
});

gulp.task('styles:dist', function() {
    return gulp.src('src/style/*.styl')
        .pipe(stylus({ compress: true }))
        .pipe(autoprefixer('> 1%, last 2 versions, Firefox ESR, Opera 12.1, ie >= 10'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('serve', ['scripts:build', 'styles:build'], function() {
    browserSync.init({
        server: ['./test', '.'],
        routes: {
            '/build': 'build',
            '/bower_components': 'bower_components'
        }
    });

    gulp.watch(['test/styles/*.styl', 'src/style/*.styl'], ['styles:build']);
    gulp.watch('test/**/*.html').on('change', browserSync.reload);
});

gulp.task('dist', ['scripts:dist', 'styles:dist'], function() {
    return gulp.src('dist/**/*.*')
        .pipe(sizereport());
});

gulp.task('scripts:gh-pages', function() {
    return gulp.src('test/scripts/index.js')
        .pipe(compile({
            output: {
                filename: 'app.js'
            }
        }))
        .pipe(replace(/<%= version %>/, getVersion()))
        .pipe(uglify())
        .pipe(gulp.dest('.gh-pages/build/'));
});

gulp.task('styles:gh-pages', function() {
    return gulp.src('test/styles/index.styl')
        .pipe(stylus())
        .pipe(autoprefixer('> 1%, last 2 versions, Firefox ESR, Opera 12.1, ie >= 10'))
        .pipe(gulp.dest('.gh-pages/build/'));
});

gulp.task('copy:gh-pages', ['scripts:gh-pages', 'styles:gh-pages'], function() {
    return gulp.src(['test/images/**', 'test/index.html'], { base: './test'} )
        .pipe(gulp.dest('.gh-pages'));
});

gulp.task('default', ['dist']);
