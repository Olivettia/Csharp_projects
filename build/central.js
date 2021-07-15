(function() {
    var Central = {};
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Central;
    } else if (typeof YUI != 'undefined' && YUI.add) {
        YUI.add('central', function(Y) {
            Y.Central = Central;
        }, '1.0.6', {
            requires: []
        })
    } else if (typeof window == 'object') {
        window.Central = Central;
    } else 