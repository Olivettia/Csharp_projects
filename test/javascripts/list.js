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
        var list2 = new List(1, 2