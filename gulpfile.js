
const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    svgstore = require('gulp-svgstore');

//удаление не нужных фалов перед экспортом готового проекта
gulp.task('clean', async function () {
    del.sync('dist')
})


// scss в css, минимизируем и делаем аутопрефиксер
gulp.task('scss', function () {
    return gulp.src('app/scss/**/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 8 versions']
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

//Уменьшаем размер изображений png, jpg, sbg https://www.npmjs.com/package/gulp-imagemin
gulp.task("images", function () {
    return gulp.src("app/img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.mozjpeg({progressive: true}),
            imagemin.svgo()]))
        .pipe(gulp.dest("app/img"));
});


//Делаем svg спрайты
gulp.task("sprite", function () {
    return gulp.src("app/img/*.svg")
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("app/img"));
});


//обновляем стили на странице при изминении css файла
gulp.task('css', function () {
    return gulp.src(['app/css/*.css'])
        .pipe(browserSync.reload({stream: true}))
});


//обновляем текст на странице при изминении html файла
gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true}))
});


//обновляем скрипты на странице при изминении js файла
gulp.task('script', function () {
    return gulp.src('app/js/*.js')
        .pipe(browserSync.reload({stream: true}))
});

//обновляем страницу
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});


//экспорт готового проекта
gulp.task('export', function () {
    let buildHtml = gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist'));

    let BuildCss = gulp.src('app/css/**/*.css')
        .pipe(gulp.dest('dist/css'));

    let BuildJs = gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('dist/js'));

    let BuildFonts = gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));

    let BuildImg = gulp.src('app/img-full/**/*.*')
        .pipe(gulp.dest('dist/img-full'));
});

//Следим за изменениями
gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
    gulp.watch('app/css/*.css'), gulp.parallel('css');
    gulp.watch('app/*.html', gulp.parallel('html'))
    gulp.watch('app/js/*.js', gulp.parallel('script'))
});

//запуск задач
gulp.task('build', gulp.series('clean', 'export')) //запуск задачи экспорта готового проекта
gulp.task('default', gulp.parallel('css', 'scss', 'browser-sync', 'watch'));