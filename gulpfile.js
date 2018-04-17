var gulp = require('gulp'),
    del = require('del'),
    args = require('yargs').argv,
    config = require('./gulp.config')(),
    gulpLoadPlugins = require('gulp-load-plugins'),
    urlAdjuster  = require('gulp-css-url-adjuster'),
    rebaseUrls = require('gulp-css-rebase-urls'),
    $ = gulpLoadPlugins({lazy: true});


/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
  var delconfig = [].concat(config.build);
  log('Cleaning: ' + $.util.colors.blue(delconfig));
  del(delconfig, done);
});

gulp.task('sort', function() {
  var js = ['app.js', 'src/**/*.js'];

  return gulp
      .src(js)
      .pipe($.print())
      .pipe($.angularFilesort())
      .pipe($.print())
});

gulp.task('vet', function() {
  var js = ['app.js', 'src/**/*.js'];

  return gulp
      .src(js)
      .pipe($.if(args.verbose, $.print()))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
      .pipe($.jshint.reporter('fail'))
      .pipe($.jscs());
});

gulp.task('default', function() {

    var wiredep = require('wiredep').stream;
    var jsSources = gulp.src(['./src/**/*.js', '!./src/dashboard/**/*.*', '!./src/**/weboffice/generic/**/*.js', '!./src/ueditor/**/*.*']);
    var cssSources = gulp.src(['./src/**/*.css', '!./src/ueditor/**/*.*', '!./src/dashboard/**/*.*']);

    return gulp
        .src('src/index.html')
        .pipe($.print())
        .pipe(wiredep({
            bowerJson: require('./bower.json'),
            directory: './bower_components/'
        }))
        .pipe($.inject(jsSources.pipe($.angularFilesort()), {relative: true}))
        .pipe($.inject(cssSources, {relative: true}))
        .pipe($.print())
        .pipe(gulp.dest('src/'));
});

gulp.task('build', ['optimize', 'fonts','fonts2', 'xls', 'images', 'images2', 'svg'], function() {

    var date = new Date();

  gulp
      .src(config.build + '**/*.css')
      //.pipe($.cssSpriter({
      //  // The path and file name of where we will save the sprite sheet
      //  'spriteSheet': './build/images/spritesheet.png',
      //  // Because we don't know where you will end up saving the CSS file at this point in the pipe,
      //  // we need a litle help identifying where it will be.
      //  'pathToSpriteSheetFromCSS': '../images/spritesheet.png'
      //}))
      //.pipe(rebaseUrls())
      //.pipe(rebaseUrls())
      .pipe($.if('**/*app*.css', urlAdjuster({
          //replace:  ['img/','images/'],
          append: '?version='+date.getTime(),
      })))
      .pipe($.sourcemaps.init())
      .pipe($.minifyCss())
      .pipe(getHeader())
      .pipe($.sourcemaps.write('maps'))
      .pipe(gulp.dest(config.build));
});

gulp.task('fonts', function() {
  return gulp
      .src(config.fonts)
      .pipe(gulp.dest(config.build + '/font/'));
});

gulp.task('fonts2',function(){
    return gulp
        .src(config.fonts2)
        .pipe(gulp.dest( config.build + '/styles/fonts/'));
});

gulp.task('xls',function(){
    return gulp
        .src(config.xls)
        .pipe(gulp.dest( config.build ));
});

gulp.task('images', function() {
    return gulp
        .src(config.images)
        //.pipe($.imagemin({optimizationLevel: 4}))
        //.pipe($.rename({
        //  dirname: "/"
        //}))
        //.pipe(gulp.dest(config.build + 'images/'));
        .pipe(gulp.dest(config.build))
        .pipe($.rename(function(path) {
            //console.log(path.dirname, path.dirname.replace(/(\.\.\/)*/, ''));
            path.dirname = path.dirname.replace(/.*\\images(.*)/, 'images$1');
            path.dirname = path.dirname.replace(/.*\\img(.*)/, 'img$1');

        }))
        .pipe(gulp.dest(config.build + 'styles/'))
        .pipe(gulp.dest(config.build));
});

gulp.task('images2', function() {
    return gulp
        .src(['./src/**/*.png', './src/**/*.jpg', './src/**/*.gif'])
        .pipe(gulp.dest(config.build));
});

gulp.task('dashboard', function() {
    return gulp
        .src(['./src/**/*.*'])
        .pipe(gulp.dest(config.build));
});

gulp.task('svg', function() {
    return gulp
        .src(config.svg)
        .pipe(gulp.dest(config.build));
});

gulp.task('wiredep', ['ueditor', 'weboffice'], function() {
  var wiredep = require('wiredep').stream;
  var options = {
    bowerJson: require('./bower.json'),
    directory: './bower_components/'
  };

  var js = ['app.js', 'src/**/*.js', '!./src/**/weboffice/generic/**/*.js', '!./src/ueditor/**/*.*', '!./src/dashboard/**/*.*'];

  return gulp
      .src(config.index)
      .pipe(wiredep(options))
      .pipe($.inject(gulp
          .src(js)
          .pipe($.angularFilesort())
          .pipe($.print())))
      .pipe(gulp.dest('./'));
});

gulp.task('templatecache', ['dashboard'], function() {
  log('Creating an AngularJS $templateCache');

  del(config.build + 'js/'+config.templateCache.file);

  gulp
      .src(config.htmltemplates)
      .pipe($.minifyHtml({empty: true}))
      .pipe(gulp.dest(config.build + '/modules/'));
      //.pipe($.angularTemplatecache(
      //    config.templateCache.file,
      //    config.templateCache.options
      //))
      //.pipe(gulp.dest(config.build + 'js'));

    return gulp
        .src(config.client + 'directives/**/*.html')
        .pipe($.minifyHtml({empty: true}))
        .pipe(gulp.dest(config.build + '/directives/'));
    //.pipe($.angularTemplatecache(
    //    config.templateCache.file,
    //    config.templateCache.options
    //))
    //.pipe(gulp.dest(config.build + 'js'));
});

gulp.task('inject', ['wiredep', 'templatecache'], function() {
  var css = [config.client+'**/*.css', '!./src/ueditor/**/*.*', '!./src/dashboard/**/*.*'];

  return gulp
      .src(config.index)
      .pipe(inject(css, ''))
      .pipe(gulp.dest('./'));
});

gulp.task('optimize', ['inject'], function() {
  var templateCache = config.build + 'js/' + config.templateCache.file;
  var filter = $.filter,
      jsFilter = filter('**/*.js', {restore: true}),
      cssFilter = filter('**/*.css', {restore: true});

  return gulp
      .src(config.index)
      .pipe(inject(templateCache, 'templates'))
      .pipe($.plumber())
      .pipe($.useref())

      .pipe($.if('js/app.js', $.ngAnnotate()))
      .pipe(jsFilter)
      .pipe($.sourcemaps.init())
      .pipe($.uglify())
      .pipe($.rev())
      .pipe($.sourcemaps.write('maps'))
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe($.rev())
      .pipe(cssFilter.restore)
      .pipe($.revReplace())
      .pipe(gulp.dest(config.build));
});

gulp.task('ueditor', function() {
    return gulp.src(config.client + 'ueditor/**/*.*')
        .pipe(gulp.dest(config.build + '/ueditor/'));
});
gulp.task('weboffice', function() {
    return gulp.src(config.client + 'modules/commons/weboffice/generic/**/*.*')
        .pipe(gulp.dest(config.build + '/modules/commons/weboffice/generic/'));
});

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
  var options = {read: false, relative: true};
  if (label) {
    options.name = 'inject:' + label;
  }

  return $.inject(orderSrc(src, order), options);
}

/** Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc (src, order) {
  //order = order || ['**/*'];
  return gulp
      .src(src)
      .pipe($.if(order, $.order(order)));
}


/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
  var pkg = require('./package.json');
  var template = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @authors <%= pkg.authors %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n');
  return $.header(template, {
    pkg: pkg
  });
}