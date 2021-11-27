# GrandCentral Features

GrandCentral is a component for quick and easy JSON dispatcher in JavaScript. Any module observing these JSON packets can retrieve only those it needs by identifying there pattern.

## GrandCentral

A static class use to match and dispatch JSON.

	GrandCentral.listen({
		status: 200,
		command: "frie