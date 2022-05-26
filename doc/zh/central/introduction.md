# Central 快速入门

如果需要监听一个事件，我们可以使用 Central.listen 。

	Central.listen("eventname", function(e) {
		/* handle event */
	});

如果需要派发一个事件，我们可以使用 Central.call 。

	Central.call("eve