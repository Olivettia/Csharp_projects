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

    var copySignature = function(signature) {
        var copy = signature.slice(0);
        if (signature.more) {
            copy.more = true;
        }
        return copy;
    };

	var parseSignature = function(signature) {
		if (signature.replace(/(^\s+|\s+$)/ig, "") === "") {
			signature = [];
		} else {
			signature = signature.split(",");
			for (var i = 0; i < signature.length; i++) {
				var typeExpression = signature[i].replace(/(^\s+|\s+$)/ig, "");
				var type = null;
				if (typeExpression == "*") {
					type = Overload.Any;
				} else if (typeExpression == "...") {
					type = Overload.More;
				} else {
					try {
						type = eval("(" + typeExpression + ")");
					} catch (error) {
						throw "type expression cannot be evaluated: " + typeExpression;
					}
				}
				signature[i] = type;
			}
		}
		return signature;
	};
    
    var inheritanceComparator = function(type1, type2) {
        if (type1 == type2) {
            return 0;
        } else if (type2 == Overload.Any) {
            return 1;
        } else if (type1 == Overload.Any) {
            return -1;
        } else if (type1.prototype instanceof type2) {
            return 1;
        } else if (type2.prototype instanceof type1) {
            return -1;
        } else {
            return 0;
