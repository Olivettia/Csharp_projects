(function() {
    var AbstractEnumerator = function() {
    };
    
    AbstractEnumerator.prototype.item = function() { throw "abstract enumerator should not be instantiated"; };
    AbstractEnumerator.prototype.next = function() { throw "abstract enumerator should not be instantiated"; };
    AbstractEnumerator.prototype.reset = function() { throw "abstract enumerator should not be instantiated"; };
    
    var ArrayEnumerator = function(array) {
        var BEFORE = 0, RUNNING = 1, AFTER = 2;
        var state = BEFORE;
        var index = 0;
        
        this.item = function() {
            if (state == RUNNING) {
                return array[index];
            } else if (state == BEFORE) {
                throw "incorrect index";
            } else if (state == AFTER) {
                throw "incorrect index";
            }
        };

        this.next = function() {
            switch (state) {
                case BEFORE:
                    if (array.length === 0) {
                        state = AFTER;
                    } else {
                        state = RUNNING;
                    }
                    break;
                case RUNNING:
                    index++;
                    if (index >= array.length) {
                        state = AFTER;
                    }
                    break;
                case AFTER:
                    break;
            }
            return (state != AFTER);
    