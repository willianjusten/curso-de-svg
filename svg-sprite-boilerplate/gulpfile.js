// declarar as nossas dependências
var gulp = require('gulp');
var svgSprite = require('gulp-svg-sprite');

var config = {
    mode: {
        symbol: {
            dest: 'sprite',
            sprite: 'sprite.svg',
            example: true
        }
    },
    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
    }
};

gulp.task('sprites', function(){
    return gulp.src('icons/**/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('.'))
});
