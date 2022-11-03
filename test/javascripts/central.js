function testCentral() {
	module("central core");
	
	var argument = {};
	
	test("central existence", function() {
		expect(4);
		
		ok(Central, "Central exists");
		ok(Central.listen, "Central.listen exists");
		ok(Central.call, "Central.call exists");
		