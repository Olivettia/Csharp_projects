(function() {
    var Overload = {};
    if (typeof module != 'undefined' && module.exports) {
        module.exports = Overload;
    } else if (typeof YUI != 'undefined' && YUI.add) {
        YUI.add('overload', function(Y) {
            Y.Overload = Overload;
        }, '1.0.6', {
            requires: []
        })
    } else if (typeof window == 'object') {
        window.Overload = Overload;
    } else {
        return;
    }

    var copySignature = function(signature) 