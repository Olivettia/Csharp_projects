function testList() {
    module("list core");

    test("list existence", function() {
        expect(5);
        
        ok(List, "List exists");
        
        var list = new List(1, 2, 3, 4, 5, 6);
        ok(list.at, "list.at exists");
        ok(list.length, "list.length exists");
        ok(list.each, "list.each exists");
        ok(list.toArray, "list.toArray exists");
    });
    
    test("list constructor", function() {
        expect(3);
        
        var count = 0;
        
        var list1 = new List();
        var list2 = new List(1, 2, 3, 4, 5, 6);
        var list3 = new List([1, 2, 3, 4, 5, 6]);
        
        same(list1.toArray(), [], "empty constructor worksly");
        same(list2.toArray(), [1, 2, 3, 4, 5, 6], "arguments constructor worksly");
        same(list3.toArray(), [1, 2, 3, 4, 5, 6], "array constructor worksly");
    });
    
    test("list at method", function() {
        expect(8);
        
        var list1 = new List(1, 2, 3, 4, 5, 6);
        var list2 = list1.drop(2).takeWhile(function() { return this < 5; }).reverse();
        
        equals(list1.at(0), 1);
        equals(list1.at(1), 2);
        equals(list1.at(2), 3);
        equals(list1.at(3), 4);
        equals(list1.at(4), 5);
        equals(list1.at(5), 6);
        
        equals(list2.at(0), 4);
        equals(list2.at(1), 3);
    });
    
    test("list length method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var result = list.length();
        
        equals(result, 6, "length result");
    });
    
    test("list each method", function() {
        expect(12);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var i = 0;
        
        list.each(function(object) {
            equals(this, i + 1, "this value");
            equals(object, i + 1, "object value");
            i++;
        });
    });
    
    test("list toArray method", function() {
        expect(1);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        
        same(list.toArray(), [1, 2, 3, 4, 5, 6], "toArray result");
    });
    
    module("list methods");
    
    test("list methods existence", function() {
        expect(26);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        
        ok(list.reverse, "list.reverse exists");
        ok(list.map, "list.map exists");
        ok(list.filter, "list.filter exists");
        ok(list.fold, "list.fold exists");
        ok(list.scan, "list.scan exists");
        ok(list.takeWhile, "list.takeWhile exists");
        ok(list.take, "list.take exists");
        ok(list.dropWhile, "list.dropWhile exists");
        ok(list.drop, "list.drop exists");
        ok(list.cycle, "list.cycle exists");
        
        ok(List.generate, "List.generate exists");
        ok(List.iterate, "List.iterate exists");
        ok(List.count, "List.count exists");
        ok(List.repeat, "List.repeat exists");
        ok(List.concatenate, "List.concatenate exists");
        ok(List.zip, "List.zip exists");
        
        ok(list.all, "list.all exists");
        ok(list.any, "list.any exists");
        ok(list.sum, "list.sum exists");
        ok(list.average, "list.average exists");
        ok(list.maximum, "list.maximum exists");
        ok(list.minimum, "list.minimum exists");
        ok(list.head, "list.head exists");
        ok(list.tail, "list.tail exists");
        ok(list.init, "list.init exists");
        ok(list.last, "list.last exists");
    });
    
    test("list reverse method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .reverse();
        
        same(list.toArray(), [6, 5, 4, 3, 2, 1], "reverse result");
        same(list.toArray(), [6, 5, 4, 3, 2, 1], "reverse result");
    });
    
    test("list map method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .map(function() { return this * 2; });
        
            same(list.toArray(), [2, 4, 6, 8, 10, 12], "map result");
            same(list.toArray(), [2, 4, 6, 8, 10, 12], "map result");
    });
    
    test("list filter method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .filter(function() { return this > 2 && this % 2; });
        
        same(list.toArray(), [3, 5], 