
import { Lesson } from './types';

export const CURRICULUM: Lesson[] = [
  {
    id: 1,
    title: "变量与赋值 (Variables)",
    module: "基础入门",
    scenario: "R 语言中推荐使用 `<-` 作为赋值符号。变量可以存储任何类型的数据。",
    task: "创建变量 `name <- \"R-Master\"` 和 `version <- 4.2`，然后分别输入变量名并回车。",
    hint: "name <- \"R-Master\"\nversion <- 4.2\nname\nversion",
    defaultCode: "name <- \"R-Master\"\nversion <- 4.2\nname\nversion",
    expectedKeywords: ["<-", "name", "version"]
  },
  {
    id: 2,
    title: "基础数据类型 (Data Types)",
    module: "数据结构",
    scenario: "R 有五种基本类型：numeric (数值), integer (整数), complex (复数), logical (逻辑), character (字符)。",
    task: "使用 `class()` 函数检查 `3.14`, `TRUE`, 和 `\"Hello\"` 的类型。",
    hint: "class(3.14)\nclass(TRUE)\nclass(\"Hello\")",
    defaultCode: "class(3.14)\nclass(TRUE)\nclass(\"Hello\")",
    expectedKeywords: ["class", "3.14", "TRUE", "Hello"]
  },
  {
    id: 3,
    title: "算术运算符 (Arithmetic)",
    module: "操作符",
    scenario: "R 支持基本的数学运算，包括求余 `%%` 和整除 `%/%`。",
    task: "计算 `10` 除以 `3` 的余数和整除结果。",
    hint: "10 %% 3\n10 %/% 3",
    defaultCode: "10 %% 3\n10 %/% 3",
    expectedKeywords: ["%%", "%/%"]
  },
  {
    id: 4,
    title: "向量创建 (Vectors)",
    module: "核心结构",
    scenario: "向量是 R 最基础的结构。使用 `c()` 合并元素，使用 `seq()` 或 `:` 生成序列。",
    task: "创建一个包含 1 到 10 的向量 `v`，并计算其长度 `length(v)`。",
    hint: "v <- 1:10\nlength(v)",
    defaultCode: "v <- 1:10\nlength(v)",
    expectedKeywords: ["1:10", "length"]
  },
  {
    id: 5,
    title: "列表 (Lists)",
    module: "核心结构",
    scenario: "列表可以包含不同类型的元素，甚至是另一个列表。",
    task: "创建一个列表 `my_list` 包含数字、字符串和逻辑值。",
    hint: "my_list <- list(1, \"A\", TRUE)\nmy_list",
    defaultCode: "my_list <- list(1, \"A\", TRUE)\nmy_list",
    expectedKeywords: ["list"]
  },
  {
    id: 6,
    title: "矩阵创建 (Matrices)",
    module: "核心结构",
    scenario: "矩阵是二维的同质数据。`nrow` 和 `ncol` 定义行和列。",
    task: "创建一个 2 行 3 列的矩阵，包含数字 1 到 6。",
    hint: "matrix(1:6, nrow=2, ncol=3)",
    defaultCode: "matrix(1:6, nrow=2, ncol=3)",
    expectedKeywords: ["matrix", "nrow", "ncol"]
  },
  {
    id: 7,
    title: "数组 (Arrays)",
    module: "核心结构",
    scenario: "数组可以有多个维度（不仅仅是 2 维）。",
    task: "使用 `array()` 创建一个 3x3x2 的数组。",
    hint: "array(1:18, dim=c(3,3,2))",
    defaultCode: "array(1:18, dim=c(3,3,2))",
    expectedKeywords: ["array", "dim"]
  },
  {
    id: 8,
    title: "因子 (Factors)",
    module: "核心结构",
    scenario: "因子用于存储类别数据，常用于统计模型。",
    task: "将向量 `c(\"Male\", \"Female\", \"Male\")` 转换为因子并查看水平 `levels()`。",
    hint: "f <- factor(c(\"Male\", \"Female\", \"Male\"))\nlevels(f)",
    defaultCode: "f <- factor(c(\"Male\", \"Female\", \"Male\"))\nlevels(f)",
    expectedKeywords: ["factor", "levels"]
  },
  {
    id: 9,
    title: "数据框 (Data Frames)",
    module: "核心结构",
    scenario: "数据框是 R 中最常用的表格结构，每列类型可以不同。",
    task: "创建一个包含姓名和年龄的数据框。",
    hint: "df <- data.frame(name=c(\"Alice\", \"Bob\"), age=c(25, 30))\ndf",
    defaultCode: "df <- data.frame(name=c(\"Alice\", \"Bob\"), age=c(25, 30))\ndf",
    expectedKeywords: ["data.frame"]
  },
  {
    id: 10,
    title: "条件判断 (If...Else)",
    module: "流程控制",
    scenario: "使用 `if` 和 `else` 来控制代码执行逻辑。",
    task: "编写判断：如果 `x > 0` 则打印 \"Positive\"。",
    hint: "x <- 5\nif(x > 0) { print(\"Positive\") }",
    defaultCode: "x <- 5\nif(x > 0) {\n  print(\"Positive\")\n}",
    expectedKeywords: ["if", "print"]
  },
  {
    id: 11,
    title: "Switch 语句",
    module: "流程控制",
    scenario: "当有多个分支时，`switch` 更加简洁。",
    task: "根据变量 `index` 的值返回对应的颜色。",
    hint: "index <- 2\nswitch(index, \"red\", \"green\", \"blue\")",
    defaultCode: "index <- 2\nswitch(index, \"red\", \"green\", \"blue\")",
    expectedKeywords: ["switch"]
  },
  {
    id: 12,
    title: "For 循环",
    module: "流程控制",
    scenario: "遍历序列中的每一个元素。",
    task: "使用循环打印 1 到 5 的平方。",
    hint: "for(i in 1:5) { print(i^2) }",
    defaultCode: "for(i in 1:5) {\n  print(i^2)\n}",
    expectedKeywords: ["for", "in", "print"]
  },
  {
    id: 13,
    title: "While 循环",
    module: "流程控制",
    scenario: "当条件满足时重复执行。",
    task: "当 `cnt < 5` 时，打印 `cnt` 并递增。",
    hint: "cnt <- 0\nwhile(cnt < 5) { print(cnt); cnt <- cnt + 1 }",
    defaultCode: "cnt <- 0\nwhile(cnt < 5) {\n  print(cnt)\n  cnt <- cnt + 1\n}",
    expectedKeywords: ["while"]
  },
  {
    id: 14,
    title: "自定义函数 (Functions)",
    module: "函数编程",
    scenario: "使用 `function` 关键字定义自己的逻辑。",
    task: "定义一个计算两个数之和的函数 `add_nums`。",
    hint: "add_nums <- function(a, b) { return(a + b) }\nadd_nums(5, 10)",
    defaultCode: "add_nums <- function(a, b) {\n  return(a + b)\n}\nadd_nums(5, 10)",
    expectedKeywords: ["function", "return"]
  },
  {
    id: 15,
    title: "字符串处理 (Strings)",
    module: "数据处理",
    scenario: "R 提供了强大的字符串操作函数，如 `paste` 和 `toupper`。",
    task: "将 \"hello\" 转换为大写，并与 \"world\" 拼接。",
    hint: "paste(toupper(\"hello\"), \"world\")",
    defaultCode: "paste(toupper(\"hello\"), \"world\")",
    expectedKeywords: ["toupper", "paste"]
  },
  {
    id: 16,
    title: "描述性统计 (Statistics)",
    module: "统计分析",
    scenario: "快速获取数据的统计特性。",
    task: "计算向量 `c(1, 2, 3, 4, 100)` 的平均值和中位数。",
    hint: "v <- c(1, 2, 3, 4, 100)\nmean(v)\nmedian(v)",
    defaultCode: "v <- c(1, 2, 3, 4, 100)\nmean(v)\nmedian(v)",
    expectedKeywords: ["mean", "median"]
  },
  {
    id: 17,
    title: "基础绘图 (Plot)",
    module: "可视化",
    scenario: "使用 `plot()` 绘制最基础的图形。WebR 会捕获绘图输出。",
    task: "绘制 1 到 10 的点图。",
    hint: "plot(1:10)",
    defaultCode: "plot(1:10, main=\"My Plot\", col=\"red\")",
    expectedKeywords: ["plot"]
  },
  {
    id: 18,
    title: "柱状图 (Bar Charts)",
    module: "可视化",
    scenario: "展示分类数据的频率。",
    task: "使用 `barplot()` 绘制一组数据的柱状图。",
    hint: "barplot(c(7, 12, 28, 3, 41))",
    defaultCode: "barplot(c(7, 12, 28, 3, 41), names.arg=c(\"A\",\"B\",\"C\",\"D\",\"E\"))",
    expectedKeywords: ["barplot"]
  },
  {
    id: 19,
    title: "直方图 (Histograms)",
    module: "可视化",
    scenario: "展示连续变量的分布。",
    task: "为 100 个随机正态分布数 `rnorm(100)` 绘制直方图。",
    hint: "hist(rnorm(100))",
    defaultCode: "hist(rnorm(100), col=\"lightblue\")",
    expectedKeywords: ["hist", "rnorm"]
  },
  {
    id: 20,
    title: "数据重塑 (Reshaping)",
    module: "高级处理",
    scenario: "合并数据集或改变数据结构。",
    task: "使用 `rbind()` (按行) 和 `cbind()` (按列) 合并两个向量。",
    hint: "v1 <- 1:3; v2 <- 4:6\nrbind(v1, v2)\ncbind(v1, v2)",
    defaultCode: "v1 <- 1:3\nv2 <- 4:6\nrbind(v1, v2)\ncbind(v1, v2)",
    expectedKeywords: ["rbind", "cbind"]
  }
];
