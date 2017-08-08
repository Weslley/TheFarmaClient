var gulp = require('gulp');

var browser_sync = require('browser-sync').create(),
    reload = browser_sync.reload;


gulp.task('browser-sync', function() {
    browser_sync.init({
        proxy: "localhost:8000"
    });
});

// Verificando atualizações nos arquivos
gulp.task('watch', ['browser-sync'], function() {
    gulp.watch("static/stylesheets/*.scss", reload);
    gulp.watch("static/javascripts/*.js", reload);
    gulp.watch("templates/").on("change", reload);
});

gulp.task('default', [ 'watch']);
