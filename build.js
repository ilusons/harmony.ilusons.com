var Metalsmith = require('metalsmith');
var define = require('metalsmith-define');
var env = require('metalsmith-env');
var date = require('metalsmith-build-date');
var pageTitles = require('metalsmith-page-titles');
var drafts = require('metalsmith-drafts');
var fileMetadata = require('metalsmith-filemetadata');
var markdown = require('metalsmith-markdown');
var justAMoment = require('metalsmith-just-a-moment');
var typography = require('metalsmith-typography');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var excerpts = require('metalsmith-excerpts');
var pagination = require('metalsmith-pagination')
var publish = require('metalsmith-publish');
var sass = require('metalsmith-sass');
var layouts = require('metalsmith-layouts');
var metallic = require('metalsmith-metallic');
var htmlMinifier = require("metalsmith-html-minifier");
var eslint = require("metalsmith-eslint");
var rssfeed = require('metalsmith-rssfeed');
var sitemap = require('metalsmith-mapsite');

var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');

var args = process.argv.slice(2);

var isP = args.some(function(v) {
    return "production".indexOf(v) >= 0;
});
var isD = args.some(function(v) {
    return "dev".indexOf(v) >= 0;
});

var app = Metalsmith(__dirname)
    .metadata({
        title: "harmony",
        description: "A new kind of music player @ ilusons",
        author: "ilusons",
        subtitle: "A new kind of music player",
        url: "http://harmony.ilusons.com",
        downloadLink: "https://play.google.com/store/apps/details?id=com.ilusons.harmony&hl=en",
        site: {
            title: "harmony",
            description: "A new kind of music player @ ilusons",
            author: "ilusons",
            url: "http://harmony.ilusons.com"
        },
        yt_link: "https://www.youtube.com/watch?v=9XahL1iJijw&list=PLR6v5-VD7fUJtQepsBTq7Wf44e_z1eM8b"
    })
    .source('./src')
    .destination('./public')
    .clean(true)

.use(define({
    development: false,
    production: true
}))

.use(env())

.use(date())

.use(pageTitles())

.use(drafts())

.use(fileMetadata([{
    pattern: "**.md",
    metadata: {},
    preserve: true
}]))

.use(markdown({
    smartypants: true,
    gfm: true,
    tables: true
}))

.use(justAMoment({
    pattern: '**.md',
    scanFiles: true,
    scanMetadata: true
}))

.use(typography({
    lang: "en"
}))

.use(permalinks({
    pattern: ":title"
}))

.use(collections({}))

.use(excerpts())

.use(pagination({}))

.use(publish({}))

.use(sass({
    file: "${source}/assets/css/styles.scss",
    outputDir: function(originalPath) {
        return originalPath.replace("sass", "css");
    }
}))

.use(layouts({
    engine: "handlebars",
    rename: true,
    partials: "layouts/partials"
}))

.use(metallic())

.use(eslint())

.use(sitemap("http://harmony.ilusons.com"));

if (!isD) {
    app.use(htmlMinifier({
        removeAttributeQuotes: false,
        keepClosingSlash: true
    }));

    app.use(rssfeed({
        collectionKey: "public",
        siteUrl: "http://harmony.ilusons.com",
        name: ":rss.xml",
    }));
}

if (isD) {
    // app.use(watch({
    //   paths: {
    //     "${source}/assets/css/*.scss": true,
    //     "layouts/**/*.html": true,
    //   },
    //   livereload: true
    // }));
    app.use(serve({
        port: 8080,
        verbose: true
    }));
}

if (module.parent) {
    module.exports = app;
} else {
    app.build(function(err) {
        if (err)
            throw err;
    });
}