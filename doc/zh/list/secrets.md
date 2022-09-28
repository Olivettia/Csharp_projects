# List 内部实现

如果你需要使用 List ，请参考对应的<a href="List_Features.text">接口文档</a>。本文档用于解释接口文档中没有提及的内部实现，但这部分实现随时可能被修改。

## List.cache()

* type: instance
* input: none
* output: Array

导出列表级别的缓存，以数组形式表示，仅用于调试时监视。修改导出缓存不影响 Li