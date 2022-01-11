---
layout: post
tags: [ NLP, Neural Network ]
category: [ Neural Network ]
title: "NLP 101: Attention Mechanism"
banner: "/assets/images/banners/NeuralNetworkBackground.jpg"
lang: "ch"
---

## Seq2Seq 模型的问题

在之前关于 `Seq2Seq` 模型的[文章]({{site.baseurl}}/2021/Seq2Seq.html)中，我们在最后提到了编码器与解码器之间的信息瓶颈问题

<figure markdown=1>
![IMG_82F6020DAD92-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_82F6020DAD92-1.jpeg)
<figcaption>Fig 1. Seq2Seq 模型中编码器与解码器之间的“瓶颈”</figcaption>
</figure>


1. 由于编码器与解码器之间只使用总结向量连接，当向编码器输入长序列时，总结向量由于维度限制可能无法包涵输入序列中的所有信息。
2. 同时，因为我们只将编码器的最后时刻的隐藏状态作为总结向量传递给了解码器，编码器中间隐藏状态的信息不可避免的被丢失了。

Attention Mechanism 最开始被提出就是为了解决 Seq2Seq 模型的这两个问题。

## 使用平均隐藏状态作为总结向量？

<figure markdown=1>
![IMG_95D1E32E6D0D-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_95D1E32E6D0D-1.jpeg)
<figcaption>Fig 2. 将编码器所有隐藏状态取平均后在每一个时刻作为输入的一部分传递给解码器</figcaption>
<figure/>

在这样的一个模型中，我们将编码器的所有隐藏状态取平均后通过与解码器的输入直接拼接将编码器的信息传递给解码器。通过计算编码器所有隐藏状态的平均值，我们解决了问题2 - 现在传递的“总结向量” $h_{avg}$ 包涵了编码器中所有隐藏状态的信息。

虽然在上图中编码器与解码器中看起来有大量的连接，但是**信息瓶颈的问题并没有在这个模型中得到解决**。因为在编码器与解码器之间所有的信息传递还是由一个单独的向量 $h_{avg}$ 完成的。实际上，由于这个总结向量要现在要传递的信息变得更多了（以前只用传递时刻 $t$ 的隐藏状态中的信息，现在要传递时刻 $0$ 到 $t$ 所有隐藏状态中的信息），在这个模型中**信息瓶颈问题反而变得更加显著了**。

这个模型还有一个缺陷 - 因为我们直接对所有时刻的隐藏状态取平均值，编码器每个时刻的隐藏状态权重都是一样的。这并不符合实际解决问题时的经验 - 当我们在翻译句子的第 $i$ 个词的时候，我们往往只会关心原句中特定的一两个词。

**总结：**


对于直接将编码器隐藏状态取平均后传递给解码器的模型，有以下这些优缺点：

* :+1: 解码器接收到了编码器所有隐藏状态的信息
* :-1: 编码器与解码器之间的信息瓶颈问题变得更加显著
* :-1: 编码器每个时刻的隐藏状态权重一样，解码器在解码时没有“重点”。

## Attention Mechanism ｜ 注意力机制

既然直接对所有编码器隐藏状态直接取平均会产生新的问题，那么我们有么有可能给解码器在每一时刻都输入一个独特的，所有编码器隐藏状态的加权平均值呢？这种动态加权平均就是 Attention 机制的核心思路

<figure markdown=1>
![IMG_485EC646512E-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_485EC646512E-1.jpeg)
<figcaption>Fig 3. 假如解码器生成的序列长度为$n$，我们生成 $n$ 个不同的总结向量，每一个总结向量都是对编码器所有隐藏状态的加权平均</figcaption>
</figure>


对于解码器的每一个时刻 $t$ ，我们都使用不同的权重计算编码器中所有隐藏状态的加权平均，并将计算结果 $c_t$ 与解码器在 $t - 1$ 时刻的输出 $y_{t-1}$ 拼接 ( concatenate) 后作为解码器在该时刻的输入。


假设输入序列长度为 $N$，在时刻 $t$ 输入到解码器中的总结向量 $c_t$ 可以这样表示

$$
c_t = \sum_{i=0}^{N}{w_i\cdot h_i}
$$

其中 $w_i$ 被称为 **注意力权重**（Attention Weight）。因为 $w_i$ 会“帮助”解码器在解码过程中“集中注意”到编码器的特定隐藏状态上。在下面的例子中，我们让模型将 “我昨天吃了一个苹果” 翻译为英文。可以看到，一个良好训练的模型会通过注意力权重帮助解码器将其“注意力”“聚焦”到编码器特定的隐藏状态上。

<figure markdown=1>
![IMG_C6C26F5222FB-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_C6C26F5222FB-1.jpeg)
<figcaption>Fig 4. 注意力权重帮助解码器在编码器所有隐藏状态中“选择性获取”所需的信息</figcaption>
</figure>

> 上图的一些解释：
> 
> `<SOS>` 表示 "Start of Sequence" - 我们使用这个 token 向模型表示“可以开始解码了”。
> 
> 为了得到英文翻译结果的主语 "I" ，模型获取**只需要中文输入的主语 “我”** 就有足够的信息了，所以 $c_0$ 的注意力权重只在 “我” 输入的隐藏状态 $h_0$ 上有较大权重
> 
> 要得到英文翻译结果中的谓语 "ate"，解码器**不但要知道中文的谓语 “吃”** ，还要知道 **中文输入的时态 “昨天”（过去），“了”（动作已经完成）**。所以 $c_1$ 的注意力权重虽然在 $h_2$ - “吃” 上最高，在 $h_1$ （“昨天”）与 $h_3$ （“了”） 也显著大于其它值。

注意力机制可以同时解决 `Seq2Seq` 模型中的两个主要问题：

1. *信息瓶颈问题* - 通过不同的注意力权重，编码器与解码器之间会传递 $n$ 个不同的总结向量。这大大拓宽了编码器与解码器之间的信息通道。

2. *中间信息丢失问题* - 注意力权重机制理论上允许解码器获得编码器中的任意隐藏状态。

那么，这个能够帮助解码器“集中注意”的神奇“注意力权重”到底是怎么实现的呢？

## Attention Mechanism 的实现与q, K, V表示法

虽然在第一个提出注意力机制的论文 [*Neural Machine Translation by Jointly Learning to Align and Translate*](https://arxiv.org/pdf/1409.0473.pdf) 中，作者并没有使用 query-Key-Value (q, K, V)的表示方法，将注意力机制真正发扬光大的论文 [*Attention is All You Need*](https://proceedings.neurips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf) 中提出的 q, K, V 表示方法一定程度上成为了事实上的“标准”。

Fig 4. 中的模型实际上是一种简化的表示方法。在实际实现注意力机制的过程中，我们会让编码器在对每一个输入 $x_t$ 输出一对 Key-value pair $K_t$ 与 $V_t$。对于解码器
的每一个隐藏状态 $s_t$，我们会让解码器在输出 $y_t$ 的同时输出一个 query 值 $q_{t + 1}$。

假如我们在解码器输出完第 $t-1$ 个token后有

$$
K = \left\langle K_0, K_1, \cdots, K_m \right\rangle
$$

$$
V = \left\langle V_0, V_1, \cdots, V_m \right\rangle
$$

$$
e^t_i = g(K_i, q_t)
$$

那么 $c_t$ 可以通过这样的方式计算：

$$
e^t = \left\langle g(k_0, q_t), g(k_1, q_t), \cdots, g(k_m, q_t)\right\rangle
$$

$$
w^t = Softmax (e^t)
$$

$$
c_t = w^t\cdot V
$$

写成伪代码的形式，我们有

```
func compute_context(q: Mat, K: Vec<Mat>, V: Vec<Mat>)
    e = new Vec<float>(m)
    for t = 1:m
        e[t] = raw_attention(q, K[t])   # Function 'g' in math above
    end

    w = softmax(e)

    c = new Mat<float>  # Initialize c as a zero tensor
    for t = 1:m
        c += w[t] * V[t]
    end
    return c
end
```
<figure markdown=1>
![IMG_536CF3684689-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_536CF3684689-1.jpeg)
<figcaption>Fig 5. 使用 q，K，V 结构实现的 Attention 模型</figcaption>
</figure>

现在我们离完全实现一个注意力结构只剩下一步之遥了 - 在上面的伪代码中有一个神奇的函数 `raw_attention` - 给定一个 query 张量与 Key 张量，这个函数会返回一个浮点数表示分配到这个 Key 所对应的 Value 张量上的注意力权重。

这个函数的实现出人意料的简单：对于两个向量 $K$ 与 $q$，它会返回这两个向量的点乘结果。

$$
g(K, q) = \frac{k_i\cdot q}{\sqrt{\dim{k_i}}}
$$

<div class="notification" markdown=1>
<h4 hide-toc=true style="margin-top: 0">2021/01/11 Update</h4>

这里我们在乘法运算完了以后还要对结果进行一个缩放 - i.e. 上面公式中除以 $\sqrt{\dim{k_i}}$ 的步骤。这是为了得到更加平滑的参数梯度。[Source](https://towardsdatascience.com/illustrated-guide-to-transformers-step-by-step-explanation-f74876522bc0)

对 Raw Attention Score 进行 Softmax 而不是直接正则化 ($w_i = \frac{w_i}{\sum_{w}}$) 则是为了让正则化后的结果“大的值更大，小的值更小”，让模型更加稳定（输出的结果更加确定）。[Source](https://towardsdatascience.com/illustrated-guide-to-transformers-step-by-step-explanation-f74876522bc0)
</div>

<div class="notification" markdown=1>
<h4 hide-toc=true style="margin-top: 0;">2021/01/09 Update</h4>

直接将 $K$ 与 $q$ 点乘是最简单的 Attention Weight 计算函数，其它函数包括

$$
g(k_i, q) = q^{\top}Wk_i
$$

其中，$W$ 是一个可学习的参数权重矩阵。
</div>

## 注意力权重的分布：英语-法语翻译模型中的例子

在下图中可以看到注意力权重的值主要分布在对角线上 —— 这是因为英语和法语句子中的语序在很大程度上是相似的。这也证明注意力权重确实可以学习到输入与输出之间的对应关系。

<figure markdown=1>
![20220105120525](https://markdown-img-1304853431.file.myqcloud.com/20220105120525.png)
<figcaption>Fig 6. 英语-法语 机器翻译模型中的注意力权重</figcaption>
</figure>
