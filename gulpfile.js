'use strict';

const gulp = require('gulp');
const webpack = require('webpack-stream');
const wp = require('webpack');
const uglify = require('gulp-uglify');//js压缩
const imagemin = require('gulp-imagemin');//图片压缩
const clean = require('gulp-clean');//清空文件夹
const rev = require('gulp-rev');//加MD5后缀
const vinylPaths = require('vinyl-paths');//操作pipe中文件路径的，加md5的时候用到了
const revReplace = require('gulp-rev-replace');//替换引用的加了md5后缀的文件名，修改过，用来加cdn前缀
const gulpif = require('gulp-if');//if判断，用来区别生产环境还是开发环境的
const del = require('del');//删除
const path = require('path');
const runSequence = require('gulp-run-sequence');//顺序执行task

//开发环境 true  生产环境false
const isDev = false;

//html处理
gulp.task('copy', () => {
    return gulp
        .src('./src/*.html')
        .pipe(gulp.dest('dist'));
});

//图片处理
gulp.task('copyImg', () => {
    return gulp
        .src('./src/img/*')
        .pipe(gulpif(!isDev, imagemin()))
        .pipe(gulp.dest('dist/img'));
});

//js处理
gulp.task('webpack', () => {
    return gulp
        .src('./src/index.js')
        .pipe(webpack({
            devtool: false,
            entry: './src/index.js',
            output: {
                filename: '[name].js',
                chunkFilename: '[id].chunk.js',
            },
            module: {
                loaders: [
                    {
                        test: /\.js?$/,
                        loader: 'babel',
                        exclude: /node_modules/,
                        include: __dirname
                    },
                    {
                        test: /\.css$/,
                        loaders: ['style', 'css'],
                        include: /node_modules/,
                    },
                    {
                        test: /\.less?$/,
                        loaders: [
                            'style-loader',
                            'css-loader',
                            'less-loader?{"sourceMap":true}'
                        ],
                        include: __dirname
                    },

                ]
            },
            plugins: [
                new wp.ProvidePlugin({
                    'Promise': 'exports?module.exports.Promise!es6-promise'
                }),
                new wp.DefinePlugin({
                    'process.env.NODE_ENV': isDev ? '"dev"' : '"production"',
                }),
            ]
        }))
        .pipe(gulpif(!isDev, uglify()))//压缩js
        .pipe(gulp.dest('./dist'))
});

gulp.task('build', () => {
    return gulp
        .src('./dist/main.js')//只MD5 main.js
        .pipe(vinylPaths())//文件md5
        .pipe(rev())//文件md5
        .pipe(gulp.dest('./dist'))
        .pipe(rev.manifest())//生成md5映射文件rev-manifest.json
        .pipe(gulp.dest('./dist'))
        .on('end', function () {
            var manifest = gulp.src(path.join('./dist', "/rev-manifest.json"));
            gulp.src('./dist/*.html')
                .pipe(revReplace({manifest: manifest}))//根据MD5映射表替换js文件
                .pipe(gulp.dest('./dist'))
                .on('end', function () {
                    del(path.join('./dist', "/main.js"));
                    del(path.join('./dist', "/rev-manifest.json"));
                })

        })
})

gulp.task('build-clean', () => {
    return gulp.src('./dist').pipe(clean());
});

//监听任务
gulp.task('watch', ['copy', 'copyImg', 'webpack'], () => {
    gulp.watch(['src/*.html'], ['copy']);
    gulp.watch(['src/img/*'], ['copyImg']);
    gulp.watch(['src/**/*.js', 'src/*.js'], ['webpack']);
    gulp.watch(['src/**/*.less', 'src/*.less'], ['webpack']);
});

//默认任务
gulp.task('run', (cb)=> {
    runSequence('build-clean', 'copy', 'copyImg', 'webpack', 'build', cb);
});

