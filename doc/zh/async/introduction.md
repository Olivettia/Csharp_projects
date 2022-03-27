# Async 快速入门

在大多数应用程序当中， Async 用于解决 Ajax 带来的复杂异步回调关系，因此先将基本的 Ajax 操作封装起来，让它返回 Operation 实例。

	/* jQuery required for this sample */
	
	var getAsync = function(url, data) {
		var operation = new Async.O