---
layout: post
title: How to Type $\LaTeX$ Fast & Elegant - A Guide from & for Beginner
tags: ["Notes", "Random"]
category: ["Notes"]
---

## 1 用 LaTeX, 而不是与 LaTeX 搏斗

> LaTeX 的设计哲学是：让使用者付出最少的努力就能得到工整美观的排版

然而，讽刺的是，大部分人（至少一开始）的体验似乎都与这个设计哲学正好相反。这是因为我们都习惯了使用 Word 这样“所见即所得”的排版软件/文字编辑器。当我们按下空格的时候，屏幕上就一定会出现一个空格。

在 LaTeX 中，因为使用的是“编辑 - 编译 - 排版”的流程，我们不能直观的立刻看到我们在`TeX`文件中做出的改变。当我们在单词之间输入好几个空格却发现排版结果中只有一个空格时，自然会感觉非常奇怪和不适应。

> 实际上，很多时候在使用 LaTeX 时如果发现打起来非常麻烦/结果特别丑，大部分时候都是我们在作茧自缚，下面举几个常见的例子 （点击展开）：

1.  <details markdown=1>
    <summary markdown=1>
    **通过 `//` 或者 `\newline` 来打“回车”，抱怨行和行都“挤在一起”**
    </summary>

    在 LaTeX 中，`//` 代表“断行” - 也就是说，下一行的内容与当前在同一段中，但是强制进行一次换行。所以 LaTeX 不会在这两行之间添加额外的空位。

    大部分情况下，你可以将一整段话连续的写在同一行中。LaTeX 会自动根据页面宽度处理换行问题。如果你需要开启一个新的段落，在行和行之间添加一个空行即可。

    正确的段落：

    > <pre><code class="tex"> [Paragraph 1] , random text with correct paragraph Pellentesque interdum sapien sed nulla. Proin tincidunt. 
    > Aliquam volutpat est vel massa. Sed dolor lacus, imperdiet non, ornare non, commodo eu, neque. Integer pretium semper justo. Proin risus. Nullam id quam. Nam neque. 
    > 
    > [Paragraph 2] , random text with correct paragraph Duis vitae wisi ullamcorper diam congue ultricies. Quisque ligula. Mauris vehicula.</code></pre>
    > ![Screen Shot 2022-02-17 at 12.51.14 AM](https://markdown-img-1304853431.file.myqcloud.com/Screen Shot 2022-02-17 at 12.51.14 AM.png)

    错误的段落（用断行，而不是新段落）：

    > <pre><code class="tex"> \textbf{[Paragraph 1]} , random text with line break Pellentesque interdum sapien sed nulla. Proin tincidunt. 
    > Aliquam volutpat est vel massa. Sed dolor lacus, imperdiet non, ornare non, commodo eu, neque. Integer pretium semper justo. Proin risus. Nullam id quam. Nam neque. \\
    > \textbf{[Paragraph 2]} , random text with line break Duis vitae wisi ullamcorper diam congue ultricies. Quisque ligula. Mauris vehicula.</code></pre>
    > ![20220217005251](https://markdown-img-1304853431.file.myqcloud.com/20220217005251.png)
    > 经典错上加错：在断行的基础上强行用 `\vspace` 等指令拉大行之间的空白，营造一种“分段”的感觉
    </details>
2.  <details markdown=1>
    <summary markdown=1>
    **通过 `$...$` 写公式，抱怨公式都堆到左边，并且挤成一团**
    </summary>

    用 `$...$` 符号括起来写的公式是“行内公式” - 也就是说，LaTeX 认为这些公式是跟普通文字写在同一行上的，所以会尽可能的压缩这些公式的高度，并且不会在行和行之间留下额外的空位

    > 行内公式：
    > <pre><code class="tex">$-\frac{2a \pm \sqrt{b^2 - 4ac}}{b}$</code></pre>
    > 结果：$-\frac{2a \pm \sqrt{b^2 - 4ac}}{b}$

    如果需要打大公式，需要使用 `$$...$$`（或者 `\begin{equation}...\end{equation}`） 打一个“公式块” - 这样渲染出来的公式会自动居中并且占用一个段落的空间

    > 多行公式：
    > 
    > <pre><code class="tex">\begin{equation*}
    >     -\frac{2a \pm \sqrt{b^2 - 4ac}}{b}
    > \end{equation*} </code></pre>
    > 
    > 结果：$$ -\frac{2a \pm \sqrt{b^2 - 4ac}}{b} $$

    如果你需要对齐多行公式（比如推导/化简长式子），使用 `\begin{equation}\begin{aligned}...\end{aligned}\end{equation}`。

    > 带对齐的多行公式：
    > <pre><code class="tex">\begin{equation*}
    >     \begin{aligned}
    >            E[X + Y] &= \sum_{j = 1}{s_j\cdot P[X + Y = s_j]}\\
    >                     &= \sum_{j = 1}{s_j\cdot \sum_{k, l \text{ s.t. } x_k + y_l = s_j}{P[X = x_k, Y = y_l]}}\\
    >                     &= \sum_{j}{\sum_{k, l \text{ s.t. } x_k + y_l = s_j}{(x_k + y_l)\cdot P[X = x_k, Y = y_l]}}\\
    >                     &= \sum_{k, l}{(x_k + y_l)\cdot P[X = x_k, Y = y_l]}\\
    >                     &= \sum_{k, l}{x_k\cdot P[X = x_k, Y = y_l]} + \sum_{k, l}{y_l\cdot P[X = x_k, Y = y_l]}\\
    >                     &= \sum_{k}x_k \cdot \sum_{l}{P[X = x_k, Y = y_l]} + \cdots \\
    >                     &= E[X] + E[Y]
    >     \end{aligned}
    > \end{equation*}</code></pre>
    > 结果：
    > 
    > $$ \begin{equation*}
            \begin{aligned}
                E[X + Y] &= \sum_{j = 1}{s_j\cdot P[X + Y = s_j]}\\
                         &= \sum_{j = 1}{s_j\cdot \sum_{k, l \text{ s.t. } x_k + y_l = s_j}{P[X = x_k, Y = y_l]}}\\
                         &= \sum_{j}{\sum_{k, l \text{ s.t. } x_k + y_l = s_j}{(x_k + y_l)\cdot P[X = x_k, Y = y_l]}}\\
                         &= \sum_{k, l}{(x_k + y_l)\cdot P[X = x_k, Y = y_l]}\\
                         &= \sum_{k, l}{x_k\cdot P[X = x_k, Y = y_l]} + \sum_{k, l}{y_l\cdot P[X = x_k, Y = y_l]}\\
                         &= \sum_{k}x_k \cdot \sum_{l}{P[X = x_k, Y = y_l]} + \cdots \\
                         &= E[X] + E[Y]
            \end{aligned}
        \end{equation*} $$
    </details>

3. 类似的例子还有很多…… 比如疯狂用 `\;` 来代替word里的“空格”， etc.

实际上，对于排版时遇到的大部分场景，LaTeX 都有提供对应的指令或环境，如果不知道对应的指令用 `\vspace`或者`\;` 来 “蛮干”，“硬干”，相当于是在和 $\LaTeX$ 搏斗，而不是使用它。

当然，也有一些情况，$\LaTeX$ 自带的排版没法满足我们的需求，这种时候，我们应该创建自己的环境/模版/样式，而不是强行拉扯 $\LaTeX$ 提供的默认模版。

## 2 创建快捷指令

### 2.1 基础快捷指令

但是这又带来了新的问题

> “是啊，LaTeX 有这些默认的模版，但是用起来麻烦死了，你看输入一个多行公式前前后后加起来要打四行，太浪费时间了”

> “虽然 LaTeX 打的公式很好看，但是真的好麻烦，打一个自然数的符号 $\mathbb{N}$ 要 `\mathbb{N}` 这么多个字符！”

对于这个问题，LaTeX 自然也有对应的解决方法，我们可以使用 `\setnewcommand` 命令为自己常用的符号设置“快捷键”。比如下面的`TeX`指令允许我们在接下来的 LaTeX 中使用 `\N` 替代 `\mathbb{N}`。

```tex
\newcommand{\N}[0]{\mathbb{N}}
```

实际上，你可以将任何常用，但是很麻烦的指令用这种快捷键的形式简化，创建快捷键的语法是

```tex
\newcommand{你想用的快捷指令}[0]{实际上的复杂长指令}
```

<div class="notification" markdown=1>
注意：这些命令应该放在 `\begin{document}` 前， `\usepackage{...}` 后的位置
</div>


<div class="notification" markdown=1>
:warning: 每新建完一个指令以后，最好**马上尝试重新编译一下文件**，因为有时候新创建的快捷键会和 LaTeX 原有指令冲突，这种时候就会出现一些奇怪的编译错误。（比如 `\and` 就是一个TeX的关键字，所以还是乖乖打 `\wedge` 吧（狗头））
</div>

### 2.2 带参数的快捷指令

使用一些其它命令，你还可以创建有参数（甚至可以设定可选参数和其缺省值）的快捷指令。比如下面的 TeX 命令会创建一个叫 `\pic` 的快捷指令

```tex
\usepackage{xparse}   % 这个包让我们能够生成带“可选参数”的快捷指令
% ...
\NewDocumentCommand{\pic}{ O{\textwidth} m }    % O = 可选参数，大括号内为缺省值，m = 必须参数
{
  \begin{center}
    \begin{figure}[ht]
      \centering\includegraphics[width=#1]{assets/#2}   % 将参数1填到 #1 的位置，参数2填到 #2 的位置
    \end{figure}
  \end{center}\FloatBarrier
}
```

在这个定义之前，在 LaTeX 中插入与页面等宽的图片 `assets/1.jpeg` 要用这么长一段：

```tex
\begin{center}
    \begin{figure}[ht]
      \centering\includegraphics[width=\textwidth]{assets/1.jpeg}
    \end{figure}
\end{center}
\FloatBarrier
```

现在，我们只需要 `\pic{1.jpeg}` 就可以做到一样的事情。如果我们想指定图片宽度为`300pt`，使用定义的可选参数 `\pic[300pt]{1.jpeg}` 即可。

## 3 创建代码模版 (需要 VS Code)

使用自定义的快捷指令可以大幅提高写 LaTeX 速度，但是会降低代码的可读性和灵活性（比如，在刚刚 `\pic` 的命令中，如果我想读取的照片不在 `assets` 文件夹中，就不能使用这个命令了）。同时，如果别人要读我的 `TeX` 文件，他看到 `\pic` 这个命令可能会一头雾水，因为这不是标准指令。

这种时候，我们就可以使用 VS Code 的 "Code Snippet" 功能，创建一个“代码模版”。输入特定指令后，在自动补全选项中选择对应的选项，VS Code 会自动向光标位置插入预制好的模版代码。

1. 输入设置好的模版简写，在自动补全列表中选中模版

    ![Screen Shot 2022-02-17 at 2.04.53 AM](https://markdown-img-1304853431.file.myqcloud.com/Screen Shot 2022-02-17 at 2.04.53 AM.png)

2. 按回车，模版被自动插入到文件中，光标自动移动到指定的位置

    ![Screen Shot 2022-02-17 at 2.04.59 AM](https://markdown-img-1304853431.file.myqcloud.com/Screen Shot 2022-02-17 at 2.04.59 AM.png)

要设置这样的模版，在 VSCode 打开的 LaTeX 文件夹中（workspace）新建一个叫 `.vscode` 的文件夹，在其中新建 `tex_snippet.code-snippets` 文件，并使用这样的格式（JSON格式）书写：

```json
{
	// Place your LaTeX_storage workspace snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and 
	// description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope 
	// is left empty or omitted, the snippet gets applied to all languages. The prefix is what is 
	// used to trigger the snippet and the body will be expanded and inserted. Possible variables are: 
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. 
	// Placeholders with the same ids are connected.
	// Example:
	// "Print to console": {
	// 	"scope": "javascript,typescript",
	// 	"prefix": "log",
	// 	"body": [
	// 		"console.log('$1');",
	// 		"$2"
	// 	],
	// 	"description": "Log output to console"
	// }
	"Clean Equation Block" : {
		"scope": "latex",
		"prefix": "EQ*",
		"body":[
			"\\begin{equation*}",
			"    $1",
			"\\end{equation*}"
		]
	},
    "新的模版描述" : {
        "scope": "latex", // 我们的模版只在 LaTeX 文件中生效
        "prefix": "WHATEVER", // 模版的简写，一般用全大写字母，减小误触发可能
        "body": [
            "first line of template",
            "    $1 <- cursor will stop here after applying template",
            "end the template"
        ]
    }
}
```

## 4 创建自己的模版/样式

挖个坑，这里我自己也一知半解的，以后再填吧
