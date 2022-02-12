---
layout: post
title: 什么是贝叶斯网络 | What is Bayes Network
tags: [ "Machine Learning", "CS188" ]
category: [ "Machine Learning"]
---

<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            tex2jax: {
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            inlineMath: [ ['$','$'], ["\\(","\\)"] ],
            displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
            }
        });
    </script>
</head>
贝叶斯网络是人们在探索机器学习时的一个重要里程碑，通过贝叶斯网络，机器学习摆脱了以往基于形式逻辑推理和庞大知识库的限制，开始了“统计学习”的新纪元。那么什么是贝叶斯网络呢？贝叶斯网络和贝叶斯统计学派又有什么关系呢?
<!--more-->



# CS188 课堂笔记 - 贝叶斯网络 Bayesian Network

Update Test

**目录**

> 1. 统计贝叶斯学派与贝叶斯公式
> 2. 什么是贝叶斯网络
> 3. 为什么我们需要贝叶斯网络
> 4. 贝叶斯网络“加速”的原理
> 5. 用朴素的贝叶斯网络识别手写数字
> 6. 参考资料

## 1 统计贝叶斯学派与贝叶斯公式

根据对统计的理解，数理统计存在**概率学派**与**贝叶斯学派**两种学派，他们之间的主要区别在于对于概率的理解方法不同

**概率学派**认为世界存在一个固定的**先验概率**，例如一枚公平的硬币抛出正反面的概率一定分别是1/2。换句话说，古典学派认为任何事件都**存在一个固定的概率模型**，虽然我们可能不知道这个概率分布中的一些参数，但是只要我们进行了足够多次的取样，我们可以通过取样的结果来推断事件的概率分布。

**贝叶斯学派**则认为世界**没有一个确定的先验概率**，假设我们只得到了事件A的样本X，那么我们就只能依靠样本X对事件A的概率分布做出推断，而不必考虑“可能出现但未出现（在样本X中）”的情况。在这种理解的背景下，我们每次对事件A进行采样就会更新我们对事件A各个情况概率分布的认知（Belief）。[1]

两个学派都各有优势，在一些简单并可以做出大量模拟的情况（例如预测抛硬币正反的概率分布）下，概率学派可以较为精确的获得某一事件的发生概率；在一些难以分析，很难模拟/大量采样的情况（例如地震概率的预测）下，贝叶斯学派则有极大的优势，可以使用有限的信息帮助我们做出合理的推断

**贝叶斯公式**是贝叶斯学派的重要理论之一，这个公式告诉了我们如何通过我们对事件A已有的认知和新的采样（evidence）B来更新事件A的**后验概率**（在事件B发生后我们对事件A概率分布的新认知）
$$
P(A \mid B) = \frac{P(B\mid A)P(A)}{P(B)}
$$
概率学派也有关于这个公式的另一套解释方法：概率学派将概率看为“结果的比例（结果A在所有结果中的概率记为P(A) ）。这个公式在这种解释下成为了描述“具有B的所有结果中有A性质的结果所占的比例 = 具有A性质的所有结果中具有B性质的结果所占的比例 $\times$ 所有结果中A的比例 / 所有结果中B的比例” [2]

## 2 什么是贝叶斯网络

贝叶斯网络是一种描述**随机变量之间互相条件独立关系的有向无环图**。在这个有向无环图中，每个节点代表一个**随机变量对其父节点的条件概率分布** $P(X_i \mid parents(X_i))$，每一条边可以理解成变量之间的联系。

> 注意：虽然一般来讲这种“联系”可以被解释为“因果关系”，但是实际上 这种关系并不一定是因果关系，只要两个变量之间互相不条件独立就应该被连在一起

在贝叶斯网络中，已知$X$的父节点$parents(X)$时$X$的条件概率分布$P(X\mid parents(X))$ 与已知$X$的父节点时网络中$X$的“祖先节点”的概率分布$P(ancestor(X)\mid parents(X))$互相条件独立。[3]

>  例子：<img src="https://gitee.com/MarkYutianChen/mark-markdown-imagebed/raw/master/20210502163124.png" alt="image-20200430104043594" style="zoom:60%;" />
>
> 在这样一给贝叶斯网络图中，E的父节点$parent(E) = \{D\}$，E不包括父节点的祖先节点$ancestor(E) = \{B, C, A\}$
>
> 通过贝叶斯网络的定义，我们可以知道随机变量C, D, E之间存在这样的关系：

$$
P(E\mid D) \perp P(C\mid D)
$$

> 也就是说

$$
P(E\mid D, B, C, A) = P(E\mid D)
$$

贝叶斯网络本质上只是一种维持子节点与其祖先节点（不包括父节点）在给定父节点的条件下互相条件独立的存储随机变量之间互相关系的数据结构。

## 3. 为什么我们需要贝叶斯网络

在生产生活中，我们经常需要对具有随机性的状态的出现概率进行推断。假设我们想用随机变量$X_0$到$X_n$来表示一个事件的“状态”，其中每一个随机变量都只有2个可能的取值：1（发生）或0（不发生） 我们这时候想要得知$P(x_1, x_2, \cdots, x_n)$这的概率分布。

如果使用直接列出一张全联合分布的概率分布表（如下）的话，整张概率分布表会有$2^n$行，每次计算一行都要计算随机变量的所有情况，这使得求解概率分布的时间复杂度极高（时间复杂度$O(n2^n)$）。

<img src="https://gitee.com/MarkYutianChen/mark-markdown-imagebed/raw/master/20210502163127.png" alt="image-20200430112420798" style="zoom: 80%;" />

如果我把这n个随机变量用贝叶斯网络表示出来，因为贝叶斯网络可以很好的表达随机变量之间的相互条件独立关系，我们的计算量可以大大减小
$$
P(x_1, x_2, \cdots, x_n) = \prod^n_{i = 1}{P(x_i | x_{i+1}, x_{i + 2}, \cdots x_n)}
$$
上面的式子中连乘号中的概率分布也可以表示为：
$$
P(x_i \mid parents(x_i), ancestor(x_i))
$$
因为我们知道 $P(ancestor(x_i)\mid parents(x_i))\perp P(x_i \mid parents(x_i))$，我们可以消去上式中给定条件里的$ancestor(x_i)$这一项

这时候，我们可以得知：
$$
P(x_1, x_2, \cdots, x_n) = \prod^n_{i = 1}P(x_i \mid parents(x_i))
$$
看到这里，你可能会觉得这个式子有些似曾相识……

是的，这里被连乘的每一项就是贝叶斯网络中每一个节点所存储的条件概率表所存储的概率分布！

这时候，在一个最多有$k$个父节点的贝叶斯网络中，求解状态的概率分布所需要的时间复杂度就被缩小到了$O(n2^k)$。虽然求解问题依然是一个非多项式时间问题（NP）， 但是在大多数情况中贝叶斯网络的使用可以有效的降低时间复杂度的幂。[3]

## 4. 贝叶斯网络“加速”的原理

为什么贝叶斯网络处理同样的问题比直接计算所有随机变量的全联合分布要快呢？这个问题其实可以在贝叶斯网络的时间复杂度表达式中看出端倪：对于一个**每个节点最多有$k$个父节点**的贝叶斯网络，求解概率分布的时间复杂度是$O(n2^k)$。这意味着如果有一个贝叶斯网络是一个**完全图**（每个节点之间都有连线）的话，它的求解时间复杂度会达到$O(n2^n)$，和全联合分布一样。

实际上，贝叶斯网络可以计算的比全联合分布快是因为贝叶斯网络可以有效的表示变量之间的条件独立关系，基于这种条件独立的假设来简化计算，从而降低算法时间复杂度。

## 5. 朴素的贝叶斯网络识别手写数字

上面简单的介绍了什么是贝叶斯网络和贝叶斯网络的存在意义，接下来我们要看一个**朴素的**贝叶斯网络用来识别MNIST数据集中的手写数字的一个实践案例

### 5.0 什么是MNIST数据集

MNIST数据集是美国国家标准与技术研究所收集整理标注的一个手写数字数据集，其中包括了60000张28\*28的8bit灰度手写数字图片作为训练集，还有10000张28\*28的8bit灰度图片作为测试集。每张图片由$28^2 = 784$个像素构成，每个像素取值（从白到黑）在$[0, 255]$的范围内。

![MNIST数据集中的一张'4'的样本](https://gitee.com/MarkYutianChen/mark-markdown-imagebed/raw/master/20210502163132.png)

每一张图像都有一个“标签”，这个标签代表着这个图片上写的数字。

### 5.1 为什么说是“朴素的”贝叶斯网络

因为在这个例子里面，我们假定每一个像素是一个单独的feature（特性），并且我们认为所有的像素之间都是互相独立的（显然不是，一个高亮的像素周边的像素大概率也比较亮）。这样一个略微脱离实际的假设使得我们可以大大简化模型的贝叶斯网络并且可以极快的求解概率分布（因为每个像素都只有一个父节点——图像的标签）。

<img src="https://gitee.com/MarkYutianChen/mark-markdown-imagebed/raw/master/20210502163134.png" style="zoom: 70%;" />

### 5.2 如何运用模型预测

对于一张给定的图片，我们把里面的784个像素看成784个随机变量，同时，我们记这个模型的标签为$label$，在这种设定下，一张图片的标签可以这样表示：
$$
label = {\underset {label\in [0, 9]}{\operatorname {arg\,max} }}\,(P(label, f_1, f_2, \cdots, f_{784}))
$$

> 对于一幅图片（给定$f_1, f_2, \cdots f_{784}$），我们希望找到一个0 - 9之间的label，使得$P(label, f_1, f_2, \cdots, f_{784})$的值最大

使用贝叶斯网络，我们可以发现这个概率$P(label, f_1, f_2, \cdots, f_{784})$可以这么计算：
$$
P(label, f_1, f_2, \cdots, f_{784}) = P(label) \cdot P(f_1 \mid label) \cdot P(f_2\mid label)\cdots P(f_{784}\mid label)
$$
我们只用完成这样的一个简单运算就可以得到一张照片是label = A的概率了：

```python
def predict(data):
    global LabelDistribution, PixelDistribution, THRESHOLD
    labelProbTable = [1] * 10
    for i in range(10):
        labelProbTable[i] *= LabelDistribution[i]
        for pixel in range(len(data)):
            if data[pixel] >= THRESHOLD: labelProbTable[i] *= PixelDistribution[i][pixel]
            else: labelProbTable[i] *= (1 - PixelDistribution[i][pixel])

    MAX_PROB, MAX_LABEL = -1, -1
    for i in range(10):
        if labelProbTable[i] > MAX_PROB:
            MAX_PROB = labelProbTable[i]
            MAX_LABEL = i
    return MAX_LABEL
```

### 5.3 如何训练模型

通过上面的公式，我们知道可以很方便的使用$P(label)$和$P(f_i\mid label)$来预测一张图片的标签，那么我们怎么获得这两种数据呢?答案是：





**数数**





是的，这个”天真烂漫的朴素贝叶斯网络“的整个训练过程只在做一件事情：数数

我们通过统计训练数据里60000个标签的概率分布来得到$P(label)$，同时我们对每一张图片的每一个像素进行统计，如果像素亮度超过阈值就记+1上去，最后得到每一个标签下所有像素超过阈值的概率，也就是$P(f_i = 1\mid label)$。

```Python
Data = [list(map(int, line.strip().split(","))) for line in open("mnist_train.csv").read().strip().split("\n")]
LabelDistribution = {i: 0 for i in range(10)}
PixelDistribution = [{i: 0 for i in range(784)} for _ in range(10)]
THRESHOLD = 100

# Calculate the P(F_i | y)
def train():
    global LabelDistribution, PixelDistribution, Data, THRESHOLD
    for line in Data:
        label = line[0]
        pixels = line[1:]
        LabelDistribution[label] += 1
        for pixel in range(len(pixels)):
            if pixels[pixel] >= THRESHOLD:
                PixelDistribution[label][pixel] += 1

    for i in range(10): normalize(PixelDistribution[i], label=i)
    normalize(LabelDistribution)
```

### 5.4 模型准确率

虽然这个模型看上去非常的不靠谱（假设所有feature相互独立），但是竟然可以达到高达84.4%的分类准确率！(当然，比起其他像神经网络一样的fancy方法，这个结果也很**朴素**）

```
NO.9999
predict: 6
actual: 6
accumulative precision: 0.844
```

## 6. 参考资料

[1]:  “hgz_dm.” *统计学中的频率学派与贝叶斯学派 - hgz_dm - 博客园*, www.cnblogs.com/hgz-dm/p/10292949.html.

[2]: “Bayes' Theorem.” *Wikipedia*, Wikimedia Foundation, 27 Apr. 2020, en.wikipedia.org/wiki/Bayes'_theorem.

[3]: Russell, Stuart J. *Artificial Intelligence: a Modern Approach*. Pearson, 2016.

[4]: 