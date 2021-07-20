(function() {
    var Async = {};
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Async;
    } else if (typeof YUI != 'undefined' && YUI.add) {
        YUI.add('async', functio