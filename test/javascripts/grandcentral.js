function testGrandCentral() {
	module("grand central core");
	
	var argument = {};
	
	test("grand central existence", function() {
		expect(4);
		
		ok(GrandCentral, "GrandCentral exists");
		ok(GrandCentral.listen