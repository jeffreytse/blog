---
layout: post
tags: [ "Machine Learning", "NLP" ]
category: [ Neural Network ]
title: "NLP 101: Word Embedding 词嵌入"
banner: "/assets/images/banners/NeuralNetworkBackground.jpg"
---

## 什么是词嵌入

在处理自然语言时，模型的输入是文本字符串，然而，我们并不能对字符串进行运算操作。为了解决这个问题，我们尝试将自然语言的词汇转换为一个连续向量空间中的向量。这个过程被称为“**词嵌入**“。用更加形式化的语言来描述，词嵌入的过程可以这样表达：

$$
\text{Natural Language} \rightarrow \mathbb{R}^n
$$

## 用 One-hot 编码进行词嵌入？

一种符合直觉，也是最简单的词嵌入方法是使用 One-hot 编码。One-hot 编码指一个 $1\times n$ 向量中只有一个分量为1，其它分量都是0。比如说我们现在想将四个单词构成的词汇表转化为向量空间，我们可以这样做：

$$
\begin{aligned}
\text{Nice} &\rightarrow [1, 0, 0, 0]\\
\text{to} &\rightarrow [0, 1, 0, 0]\\
\text{meet} &\rightarrow [0, 0, 1, 0]\\
\text{you} &\rightarrow [0, 0, 0, 1]
\end{aligned}
$$

但是这样有几个很明显的坏处：

* 如果我们的词汇表中有 10,000 个单词，作为映射目标的向量空间会拥有 10,000 个维度。这会导致任何试图对词向量进行运算的尝试都需要极大的计算量，也就是常说的“维度灾难”问题
* 在进行完词嵌入后，词语的“意思”被完全丢失了。在进行完映射后，任何词语之间的向量距离都是相同的。一个理想的映射应该在进行完词嵌入后尽可能的保留词汇本身的信息。比如我们会希望代表 “my” 和 “me” 的词向量之间的距离小于代表 “me” 和 “sun” 的词向量之间的距离。

## 使用神经网络“拟合”词嵌入函数

为了解决这些问题，我们可以使用一种新的 approach。**假设存在一个理想的函数 $f$ 能够将自然词汇映射为一个有意义的词向量。我们可以训练一个神经网络来拟合这个函数**

但是这引入了一个新的问题 - 神经网络在训练过程中需要一个明确定义的损失函数来进行反向传播与参数更新。然而**我们是不知道最佳词嵌入函数的输出的，也就是说如果直接拟合词嵌入函数的话我们没有 Ground Truth / Labeled Data** 

解决这个问题的方法非常简单：我们**先给神经网络一个已经 well-defined 的问题来进行训练，然后使用训练好的模型在推理阶段来创建自然语言到词向量空间之间的映射**。在寻找词嵌入这个问题上，我们可以在训练阶段给定模型上下文（context）让模型预测在一个特定位置的词的概率分布。

## NNLM - 第一批试图解决NLP问题的神经网络

### 用NNLM预测词汇序列

NNLM 是 “Neural Net Language Model” 的缩写。这是第一批用来解决自然语言处理问题的神经网络模型之一。NNLM 一开始的目的是**给定第$n$个到第$n + k - 1$个词汇 ，预测第 $n + k$ 个词汇的概率分布**。

一个NNLM模型由三个部分组成：

1. 使用一个参数矩阵 $C$ 将 One-hot 编码的词向量转换为 $\mathbb{R}^n$ 向量空间中的一个向量

    <img src="https://markdown-img-1304853431.file.myqcloud.com/image-20211125121222905.png" alt="image-20211125121222905" style="width:500px">

2. 将上一步得到的词向量拼接起来，我们可以得到一个“上下文”向量 $x$。通过一个非线性的隐藏层 $b + Wx + \tanh{(b_2 + W_2x)}$的计算，我们会得到在 $n + k$ 位置的词汇“概率分布”。这里的“概率分布”打了引号因为这时候的向量并不满足一些概率分布的特征：比如各个分量都为非负数且相加之和为1。

    ![image-20211125121235835](https://markdown-img-1304853431.file.myqcloud.com/image-20211125121235835.png)

3. 为了将最后输出的向量变成真正的概率分布，我们需要用 Softmax 函数处理（正则化）这个向量

    ![image-20211125121729274](https://markdown-img-1304853431.file.myqcloud.com/image-20211125121729274.png)

### NNLM 构建词嵌入

然而，正如在前文所说的一样，**训练好的NNLM 实际上表示着一种创建词嵌入的函数**。假如我们的词汇表只有四个单词 “Once”, “upon”, “a”, “time”，我们现在给定 “upon” “a” “time”，想预测 “there” 这个位置的词汇。

“Once upon a time **there** ...”

这个词汇并不在我们的词汇表中，这种情况下，我们可以将这个词的词向量以“预测结果的词向量的加权和”来定义：

$$
C(j) \leftarrow \sum_{i\in V}{C(i)P(i \mid w_{t-n+1}^{t-1})}
$$

下面是一个描述这种构建方法的 toy demo

![image-20211125191009240](https://markdown-img-1304853431.file.myqcloud.com/image-20211125191009240.png)

## Word2Vec 模型

在[Word2Vec 论文](https://arxiv.org/pdf/1301.3781.pdf)中，作者建立了两种不同的神经网络模型来进行词嵌入。

### Word2Vec CBOW 模型

CBOW 是 “Continuous Bag of Words” 的缩写。这是一种用目标词汇周围的单词进行采样的词嵌入模型。

这个模型是基于 NNLM 的基础上进行改进得到的，它与NNLM不一样的地方主要有两点：

* CBOW为了预测 $t$ 位置的单词，这个模型会接受 $t$ 周围的单词 - $t-1$, $t-2$,..., $t+2$ 位置的词汇，而 NNLM 只会接受 $t$ 之前的单词。

* NNLM 中在第二部里面会将所有的词向量拼接起来，而 CBOW 会对这些词向量进行按位相加。因为加法是满足交换律的，所以这些输入的词汇的顺序是无关紧要的。这也是为什么这个模型叫做 “Bag of Word” - 词汇的顺序是无关紧要的。

通过和 NNLM 一样的方法，我们可以从训练好的 CBOW 模型中获得自然语言与词向量空间之间的映射关系。

![IMG_EAF813800A83-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_EAF813800A83-1.jpeg)

### Word2Vec Skip Gram 模型

Skip Gram 是一种和 CBOW 完全相反的模型 - 给定第 $k$ 个词，Skip gram 模型会预测这个词周边的词的概率分布。

![IMG_E465C9E1EBF7-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_E465C9E1EBF7-1.jpeg)

### CBOW 还是 Skip Gram?

在论文中，作者表示 Skip-gram 模型在小数据集上表现更好，而且对于词频较低的词汇依然能够较好的提取词向量。而 CBOW 的训练速度普遍高于 Skip-gram 并且对于高词频词汇的词向量估计质量更高。

## 词嵌入真的能够保留词汇的意思吗？

我认为是可以的！这里是一个论文中举的很神奇的demo：

```
vec("king") - vec("man") + vec("woman") = vec("queen")
```

也就是说，当你将 “king” 的词向量与 “man”的词向量相减后，你会得到一种表示类似”王权“语义的词向量，当在这个语义的基础上加上表示女性的词向量你就会得到 “queen”。

## 参考材料

https://arxiv.org/pdf/1301.3781.pdf

https://towardsdatascience.com/nlp-101-word2vec-skip-gram-and-cbow-93512ee24314

https://www.baeldung.com/cs/word-embeddings-cbow-vs-skip-gram

https://zhuanlan.zhihu.com/p/206878986

https://www.youtube.com/watch?v=kEMJRjEdNzM&list=PLoROMvodv4rOhcuXMZkNm7j3fVwBBY42z
