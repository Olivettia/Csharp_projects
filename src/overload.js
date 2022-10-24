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
        }
    };
    
    var overloadComparator = function(overload1, overload2) {
        var signature1Better = false;
        var signature2Better = false;
        var signature1 = overload1.signature;
        var signature2 = overload2.signature;
        if (!signature1.more && signature2.more) {
            /* Function.more only exists in the second signature */
            signature1Better = true;
            signature1 = copySignature(signature1);
            signature1.length = signature2.length;
        } else if (signature1.more && !signature2.more) {
            /* Func