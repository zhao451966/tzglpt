module.exports = function () {

    var client = './src/';
    var bower_components = './bower_components/';

    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };

    var config = {

        build: './build/',

        client: client,

        index: client + 'index.html',

        htmltemplates: client + 'modules/**/*.html',

        images: [client + '**/images/**/*.*', client + '**/img/**/*.*'],

        svg: client + '**/svg/**/*.svg',

        fonts: client + 'styles/font-awesome/font/*.*',

        fonts2: bower_components + '/slick-carousel/slick/fonts/*.*',

        xls: [client + '**/*.xls', client + '**/*.xlsx', client + '**/*.doc', client + '**/*.docx'],

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'demo',
                root: '/fosun/',
                standalone: false
            }
        },

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        }
    };

    return config;
};