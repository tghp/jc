const Gulppress = require('@tghp/gulppress');

// Create a gulppress instance
const gulppress = new Gulppress(__dirname);

// Pass gulppress to local extender
require('./gulppress.extend')();

// Export tasks for gulp
module.exports = gulppress.getTasks();