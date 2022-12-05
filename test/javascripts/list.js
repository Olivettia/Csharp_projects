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
        ok(list.take, 