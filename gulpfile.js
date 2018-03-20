var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sequence = require('gulp-sequence');
var strip = require('gulp-strip-comments');
var cp = require('child_process');
var distFiles = [
    'dist/graphics/Renderable.js',
    'dist/graphics/*.js',
    'dist/physics/*.js',
    'dist/physics/shapes/NtShapeBase.js',
    'dist/physics/shapes/*.js',
    'dist/physics/collision/*.js',
    'dist/physics/collision/collision_checkers/*.js',
    'dist/main.js',
];

gulp.task('generateConcatenatedJs', function(){
  return gulp.src(distFiles)
    .pipe(concat('newtn.js'))
    .pipe(strip())
    .pipe(gulp.dest('.'));
});
gulp.task('generateMinJs', function(){
  return gulp.src(distFiles)
    .pipe(concat('newtn.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});
gulp.task('compile', function(callback) {
    cp.execSync('tsc -p tsconfig.json');
    callback();
});
gulp.task('watch', function(){
    gulp.watch([
      'src/**/*.ts',
  ], ['compileAndGenerateLibFiles']);
})
gulp.task('compileAndGenerateLibFiles', function(callback) {
    sequence('compile', 'generateConcatenatedJs', 'generateMinJs')(callback)
});
