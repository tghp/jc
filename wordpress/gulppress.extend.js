const { series } = require('gulp');

module.exports = () => {
    // Change default task here
    const defaultTask = series(
        global.gulppress.getTask('styles'),
    );
    defaultTask.displayName = 'default';
    defaultTask.description = 'Compile scripts and styles';

    global.gulppress.setDefaultTask(defaultTask);
};