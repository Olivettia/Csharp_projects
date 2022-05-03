# Async 内部实现

如果你需要使用 Async ，请参考对应的<a href="Async_Features.text">接口文档</a>。本文档用于解释接口文档中没有提及的内部实现，但这部分实现随时可能被修改。

## Async.Operation

在实例化一个异步操作时，可以传入一组选项。如果其中的 chain 属性为 true ，则该异步操作与 Async.chain() 创建的异步调用队列无异。

	var operation = new Async.Operation({ chain: true });

### Async.Operation.error

* type: instance

异步操作的错误信息。

### Async.Operation.go()

* type: instance
* input:
	* value (optional)
* output: this : Operation

Async.Operation.yield 的别名，在异步队列中使用。

### Async.Operat