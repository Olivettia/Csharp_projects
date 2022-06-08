# JavaScript 辅助模块

JavaScript 辅助模块是一组专门用于构建复杂 Ajax 应用的基础模块。这些模块有一个共同点，就是它们都让你更多地用声明式语言描述问题，更少地用命令式语言解决问题。从本质上来说，它们相当于在 JavaScript 之上建立了各自问题领域的 Internal DSL (Domain Specific Language) ，并且鼓励你使用这些 Internal DSL 描述该领域的问题，然后模块内部的逻辑会为你求解这些问题，你也就无需编写控制求解过程的命令。

## Async

* <a href="async/introduction.html">快速入门</a>
* <a href="async/features.html">接口文档</a>
* <a href="async/secrets.html">实现文档</a>

如果你的应用程序涉及大量的 Ajax 操作，并且采用了分层的设计思想， Async 能够简化异步操作的接口，使得你可以如同控制同步流程一样控制异步流程。如果你的应用程序还涉及 Ajax 操作队列， Async 能够简化这些队列的实现，让你以声明式语言描述异步队列。

你可以使用 Async 封装最基础的 Ajax 操作，从而使得整个应用程序都通过 Async.Operation 来管理 Ajax 操作，而无需为异步函数加入回调参数。在下面这个