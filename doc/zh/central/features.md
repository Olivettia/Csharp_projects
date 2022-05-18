# Central 说明文档

Central 是一个用于在 JavaScript 环境中快速创建事件派发者的组件。

## Central

用于监听事件和派发事件的静态类。

	Central.listen("move", function(e) {
		element.style.left = parseInt(element.style.left) + e.x + "px";
		element.style.top = parseInt(