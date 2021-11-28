# GrandCentral Features

GrandCentral is a component for quick and easy JSON dispatcher in JavaScript. Any module observing these JSON packets can retrieve only those it needs by identifying there pattern.

## GrandCentral

A static class use to match and dispatch JSON.

	GrandCentral.listen({
		status: 200,
		command: "friendstatus"
	}, function(json) {
		/* update friend status */
	});
	
	GrandCentral.call({
		status: 200,
		command: "friendstatus",
		content: [
			{
				username: "user0",
				status: "online"
			},
			{
				username: "user42",
				status: "away"
			}
		]
	});

### GrandCentral.listen()

* type: static
* input:
	* filter : Function || Object
	* handler : Function
* output: Central

Use a test function or a JSON pattern to match JSON packets. The handler will only receive JSON packets passed the test function or matched with the JSON pattern.

	GrandCentral.listen(function(json) {
		return (json.status == 200 && json.command == "friendstatus")
	}, function(json) {
		/* update friend 