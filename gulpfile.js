const { src, dest, task, series, watch, parallel } = require('gulp')
const { DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS } = require('./gulp.config')
const rm = require('gulp-rm')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const gcmq = require('gulp-group-css-media-queries')
const cleanCss = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const svgo = require('gulp-svgo')
const svgSprite = require('gulp-svg-sprite')
const gulpIf = require('gulp-if')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const env = process.env.NODE_ENV

sass.compiler = require('node-sass')

task('clean', () => {
    return src([
            `${DIST_PATH}/**/*`, 
            `!${DIST_PATH}/img/**/*`,
            `!${DIST_PATH}/fonts/**/*`,
            `!${DIST_PATH}/icons/**/*`
        ], {read: false})
        .pipe(rm())
})

task('clean:all', () => {
    return src(`${DIST_PATH}/**/*`, {read: false})
        .pipe(rm())
})

task('copy:html', () => {
    return src(`${SRC_PATH}/*.html`)
        .pipe(dest(`${DIST_PATH}`))
        .pipe(reload({stream: true}))
})

task('copy:fonts', () => {
    return src(`${SRC_PATH}/fonts/**/*`)
        .pipe(dest(`${DIST_PATH}/fonts`))
})

task('copy:icons', () => {
    return src(`${SRC_PATH}/icons/**/*`)
        .pipe(dest(`${DIST_PATH}/icons`))
})

task('copy:css', () => {
    return src([...STYLES_LIBS])
        .pipe(dest(`${DIST_PATH}/css`))
})

task('scss', () => {
    return src(`${SRC_PATH}/scss/style.scss`)
        .pipe(gulpIf(env === 'dev', sourcemaps.init()))
        .pipe(concat('style.min.scss'))
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(env === 'prod', autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        })))
        .pipe(gulpIf(env === 'prod', gcmq()))
        .pipe(gulpIf(env === 'prod', cleanCss()))
        .pipe(gulpIf(env === 'dev', sourcemaps.write()))
        .pipe(dest(`${DIST_PATH}/css`))
        .pipe(reload({stream: true}))
})

task('copy:js', () => {
    return src([...JS_LIBS])
        .pipe(dest(`${DIST_PATH}/js`))
})

task('js', () => {
    return src(`${SRC_PATH}/js/*.js`)
        .pipe(gulpIf(env === 'dev', sourcemaps.init()))
        .pipe(concat('main.min.js', {newLine: ';'}))
        .pipe(gulpIf(env === 'prod', babel({
            presets: ["@babel/env"]
        })))
        .pipe(gulpIf(env === 'prod', uglify()))
        .pipe(gulpIf(env === 'dev', sourcemaps.write()))
        .pipe(dest(`${DIST_PATH}/js`))
        .pipe(reload({stream: true}))
})

task('img:webp', () => {
    return src(`${SRC_PATH}/img/**/*.{png,jpg,jpeg}`)
        .pipe(webp())
        .pipe(dest(`${DIST_PATH}/img`))
})

task('img', () => {
    return src(`${SRC_PATH}/img/**/*.{png,jpg,jpeg}`)
        .pipe(imagemin())
        .pipe(dest(`${DIST_PATH}/img`))
})

task('icons', () => {
    return src(`${SRC_PATH}/icons/*.svg`)
        .pipe(svgo({
            plugins: [
                {
                    removeAttrs: {
                        attrs: "(fill|stroke|style|width|data.*)"
                    }
                }
            ]
        }))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest(`${DIST_PATH}/i`))
})

task('server', () => {
    browserSync.init({
        server: {
            baseDir: `./${DIST_PATH}`
        },
        open: false
    })
})

task('watch', () => {
    watch(`./${SRC_PATH}/scss/**/*.scss`, series('scss'))
    watch(`./${SRC_PATH}/js/**/*.js`, series('js'))
    watch(`./${SRC_PATH}/*.html`, series('copy:html'))
})

task('init', () => {
    return src('*.*', {read: false})
        .pipe(dest(`${DIST_PATH}`))
        .pipe(dest(`${SRC_PATH}`))
})

task('static',
    series(
        'clean:all',
        parallel('img', 'img:webp', 'copy:icons', 'copy:fonts')
    )
)

task('default', 
    series(
        'clean', 
        parallel('copy:html', 'copy:css', 'copy:js', 'scss', 'js'), 
        parallel('watch', 'server')
    )
)

task('build', 
    series(
        'clean:all', 
        parallel('copy:html', 'scss', 'js', 'img', 'img:webp', 'copy:icons', 'copy:fonts')
    ) 
)
