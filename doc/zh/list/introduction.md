# List 快速入门

要使用 List ，首先需要创建一个基于 Array 的 List ，然后各种演算都可以通过 List 进行。完成演算后，可以使用 toArray 方法将数据输出为 Array ，可以使用 each 方法遍历数据，还可以通过 at 方法按索引访问数据。

    var originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var originalList = new List(originalArray);
    
    var calculatedList = originalList
        .map(function(i) { return i * (i + 1) / 2; })
        .filter(function(i) { return i > 10 && i < 50; })
    
    var calculatedArra