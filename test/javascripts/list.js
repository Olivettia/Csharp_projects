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
        
        same(list.toArray(), [3, 5], "filter result");
        same(list.toArray(), [3, 5], "filter result");
    });
    
    test("list fold method", function() {
        expect(2);
        
        var product = new List(1, 2, 3, 4, 5, 6)
            .fold(function(accumulation, i) { return accumulation * i; }, 1);
        
        equals(product, 720, "fold result");
        equals(product, 720, "fold result");
    });
    
    test("list scan method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .scan(function(accumulation, i) { return accumulation * i; }, 1);
        
        same(list.toArray(), [1, 1, 2, 6, 24, 120, 720], "scan result");
        same(list.toArray(), [1, 1, 2, 6, 24, 120, 720], "scan result");
    });
    
    test("list takeWhile method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .takeWhile(function() { return this < 4; });
        
        same(list.toArray(), [1, 2, 3], "takeWhile result");
        same(list.toArray(), [1, 2, 3], "takeWhile result");
    });
    
    test("list take method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .take(2);
        
        same(list.toArray(), [1, 2], "take result");
        same(list.toArray(), [1, 2], "take result");
    });
    
    test("list dropWhile method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .dropWhile(function() { return this < 4; });
        
        same(list.toArray(), [4, 5, 6], "dropWhile result");
        same(list.toArray(), [4, 5, 6], "dropWhile result");
    });
    
    test("list drop method", function() {
        expect(2);
        
        var list = new List(1, 2, 3, 4, 5, 6)
            .drop(2);
        
        same(list.toArray(), [3, 4, 5, 6], "drop result");
        same(list.toArray(), [3, 4, 5, 6], "drop result");
    });
    
    test("list cycle method", function() {
        expect(4);
        
        var list1 = new List(1, 2, 3, 4, 5, 6)
            .cycle()
            .take(20);
        var list2 = new List()
            .cycle();
        
        same(list1.toArray(), [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2], "cycle result");
        same(list1.toArray(), [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2], "cycle result");
        equals(list2.length(), 0, "cycle empty list length");
        equals(list2.length(), 0, "cycle empty list length");
    });
    
    test("list generate method", function() {
        expect(4);
        
        var a = 0, b = 1;
        var list1 = List
            .generate(function(proxy) {
                proxy.yield(a);
                var aNext = b;
                var bNext = a + b;
                a = aNext;
                b = bNext;
            })
            .take(10)
        
        var i = 5;
        var list2 = List
            .generate(function(proxy) {
                if (i <= 0) {
                    proxy.end();
                }
                proxy.yield(i);
                i--;
            })
            .take(10)

        same(list1.toArray(), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], "generate result");
        same(list1.toArray(), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], "generate result");
        same(list2.toArray(), [5, 4, 3, 2, 1], "generate result");
        same(list2.toArray(), [5, 4, 3, 2, 1], "generate result");
    });
    
    test("list iterate static method", function() {
        expect(2);
        
        var list = List
            .iterate(function() { return this * 2; }, 1)
            .take(10);
        
        same(list.toArray(), [1, 2, 4, 8, 16, 32, 64, 128, 256, 512], "iterate result");
        same(list.toArray(), [1, 2, 4, 8, 16, 32, 64, 128, 256, 512], "iterate result");
    });
    
    test("list count static method", function() {
        expect(4);
        
        var list1 = List
            .count()
            .drop(10)
            .take(10);
        
        var list2 = List
            .count(100, 3)
            .drop(10)
            .take(10);
        
        same(list1.toArray(), [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "count result");
        same(list1.toArray(), [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], "count result");
        same(list2.toArray(), [130, 133, 136, 139, 142, 145, 148, 151, 154, 157], "count result");
        same(list2.toArray(), [130, 133, 136, 139, 142, 145, 148, 151, 154, 157], "count result");
    });
    
    test("list repeat static method", function() {
        expect(2);
        
        var list = List
            .repeat(42)
            .drop(10)
            .take(10);
        
        same(list.toArray(), [42, 42, 42, 42, 42, 42, 42, 42, 42, 42], "repeat result");
        same(list.toArray(), [42, 42, 42, 42, 42, 42, 42, 42, 42, 42], "repeat result");
    });
    
    test("list concatenate static method", function() {
        expect(2);
        
        var list = List.concatenate(
            new List(1, 2, 3, 4, 5, 6),
            new List([]),
            new List([]),
            new List(7, 8, 9, 10, 11, 12),
            new List(13, 14, 15, 16, 17, 18));
        
        same(list.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "concatenate result");
        same(list.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], "concatenate result");
    });
    
    test("list zip static method", function() {
        expect(2);
        
        var list = List.zip(
            function(x, y, z) {
                return {
                    "x": x,
                    "y": y,
                    "z": z
                };
            },
            new List(1, 2, 3, 4, 5, 6),
            new List(7, 8, 9, 10),
            new List(11, 12, 13, 14, 15, 16, 17, 18, 19, 20));
        
        same(list.toArray(), [
            { "x": 1, "y": 7, "z": 11 },
            { "x": 2, "y": 8, "z": 12 },
            { "x": 3, "y": 9, "z": 13 },
            { "x": 4, "y": 10, "z": 14 }
        ], "zip result");
        same(list.toArray(), [
            { "x": 1, "y": 7, "z": 11 },
            { "x": 2, "y": 8, "z": 12 },
            { "x": 3, "y": 9, "z": 13 },
            { "x": 4, "y": 10, "z": 14 }
        ], "zip result");
    });
    
    test("list all method", function() {
        expect(4);
        
        var list = new List(1, 2, 3, 4, 5, 6);
        var result1 = list.all(function() { return this > 0; });
        var result2 = list.all(function() { return this > 1; });