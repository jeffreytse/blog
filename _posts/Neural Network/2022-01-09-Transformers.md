---
layout: post
tags: [ NLP, Neural Network ]
category: [ Neural Network ]
title: "NLP 101: Transformer Framework"
banner: "/assets/images/banners/NeuralNetworkBackground.jpg"
lang: "ch"
---

## 0 背景知识

1.  [词嵌入 - Word Embedding]({{site.baseurl}}/2021/Word-Embedding.html)

    一种将自然语言在转化为向量表示的同时保留词汇原有的语义余上下文信息的方法（将高维的自然语言“嵌入”到低维向量空间）

2.  [编码器-解码器结构 - Encoder-Decoder Architecture]({{site.baseurl}}/2021/Seq2Seq.html) 

    编码器-解码器结构将任务分成两个步骤：先由编码器将输入编码/总结，再通过解码器将编码结果解析成真正的输出

3.  [注意力机制 - Attention Mechanism]({{site.baseurl}}/2022/Attention-Mechanism.html)

    一种通过动态赋予编码器所有隐藏状态权重让解码器充分，有重点的获取信息的方法。

## 1 Self-Attention 自注意力机制

<h3 hide-toc=true>1.1 Self-Attention 与 Attention 的区别</h3>

注意力机制的提出是作为解决 Seq2Seq 模型中的信息瓶颈与中间状态丢失问题的一个解决方案。然而，在 Google 2018 年发表的论文 *Attention is All You Need* 中，研究人员们创新性的提出了“自注意力机制”。在这种注意力机制的变种中，注意力机制不再作为连接模型两个部分的中间件出现。

<figure markdown=1>
![IMG_D6D1A983D5DF-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_D6D1A983D5DF-1.jpeg)
<figcaption>Fig 1. 注意力机制 vs. 自注意力机制</figcaption>
</figure>

如 Fig 1 所示，在自注意力机制中，我们让 $q_t = k_t = v_t = h_t$，并将注意力权重在各个隐藏状态上的加权平均直接输出。这也是这个结构名称“自注意力机制”的来由 —— 用来计算注意力权重的 $q_i$ 与 $k_i$ 都来自于同一层数据（自己）。

<figure markdown=1>
![IMG_1E706864A324-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_1E706864A324-1.jpeg)
<figcaption> Fig 2. 自注意力机制的 $q$, $k$, $v$ 都来自于“自己”</figcaption>
</figure>

<h3 hide-toc=true>1.2 删去传统 NLP 模型中的 RNN 结构 - Attention is All You Need！</h3>

仔细分析 Fig 2 中的结构，我们会发现实际上自注意力机制的结构还可以更加简单。我们在 Seq2Seq 模型中使用 LSTM 是为了让模型获知整个输入序列的上下文内容。然而，在 Self-Attention 模型中，这么做似乎没有什么意义。因为注意力机制单独可以保证输出层可以获得整个输入序列的上下文。

所以，我们实际上可以直接删去 Self-Attention 结构中的 RNN 而不影响模型获取的信息量。这也是论文题目 ***Attnetion is All You Need***  的意思了 —— 我们的模型实际上可以只使用自注意力机制，完全不使用之前十多年中各类解决 NLP 问题的模型的核心结构 - 递归神经网络 RNN。


<figure markdown=1>
![IMG_AB1D95A09BC4-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_AB1D95A09BC4-1.jpeg)
<figcaption> Fig 3. 删去 RNN 连接后的自注意力层，输出依然可以获得整个输入序列的上下文</figcaption>
</figure>

<h3 hide-toc=true>1.3 自注意力机制 vs 全连接层？</h3>

观察 Fig 2，不难发现自注意力结构的输出结果其实就是输入的线性结合而已。如果是这样的话，那自注意力层与全连接层有什么区别呢？难道经过了十多年的发展，神经网络的研究者们又用 fancy 的方法重新发明了一次全连接层吗？

<figure markdown=1>
![IMG_E4BF48EFE99F-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_E4BF48EFE99F-1.jpeg)
<figcaption> Fig 4. 自注意力层与全连接层非常相似 —— 从某种意义上说</figcaption>
</figure>

**实际上自注意力机制可以看成一种更加高级，抽象的全连接层。**与全连接层直接学习神经元之间的权重不同，自注意力机制在训练过程中会学习如何分配神经元之间权重使得损失函数最小化。 如果说全连接层是在直接学习 $y = Wx$ 中的权重参数 $W$，那么自注意力机制则是在学习 $g: x \rightarrow W$ 这样一个**根据输入动态计算权重**的函数。

同时，因为自注意力机制不是直接学习神经元之间的权重，我们可以在不定长度的输入上使用自注意力机制。

<h3 hide-toc=true>1.4 自注意力机制 vs 递归神经网络？</h3>

自注意力机制在建立输出与整个输入序列之间的联系的同时避免了递归神经网络的许多缺点：

因为在自注意力机制中没有递归调用自身参数，我们不会有梯度消失/爆炸问题。

同时，因为在递归神经网络中，每一个时刻网络的状态都由该时刻前网络的状态所决定，我们*不能并行*的处理输入序列。在自注意力机制中，因为输出中的每一个分量都是互相独立的，我们可以并行的计算所有输出分量。这可以让模型的计算速度大幅增加。

在论文中，作者比较了 自注意力机制，递归神经网络和卷积的时间复杂度与并行运算时间 （假设词向量维度为 $d$，输入序列长度为 $n$，卷积核尺寸为 $k\times k$）

| | Time Complexity | Work Span |
|-:|:-:|:-:|
| Self-Attention | $O(n^2\cdot d)$ | $O(1)$ |
| Recurrent NN | $O(n\cdot d^2)$ | $O(n)$ |
| Convolution | $O(k\cdot n\cdot d^2)$ | $O(1)$ |

可以发现，在输入序列长度不超过词向量维度的情况下，自注意力机制的时间复杂度与并行运算时间都是三种模型中最小的。
## 2 Multi-Head Attention 多头注意力机制

现在我们将上文提到的自注意力机制封装成一个模块 - 向这个模块输入长度相同的向量 $K$，$V$ 和 $Q$，模块会输出长度相同的一个结果 $Y$。

<figure>
    <img src = "https://markdown-img-1304853431.file.myqcloud.com/IMG_60993124ACDA-1.jpeg" style="zoom: 20%"/>
    <figcaption> Fig 5. 为了方便下文讨论，我们将自注意力层封装成一个模块讨论</figcaption>
</figure>

虽然在上文关于自注意力机制的讨论中，我们为了方便起见，让 $q_i = k_i = v_i = x_i$，在实际的 Self-Attention 模型中，我们会分别对 $x$ 进行不同的操作得到不同的 $Q$, $K$, $V$。

我们可以将这些操作用矩阵 $W$ 表示：

$$
Q = W_q X,\quad K = W_k X,\quad V = W_v X
$$

其中，这三个 $W$ 矩阵都是模型中**可学习的参数**。而我们上面的例子中则使用的是 $W_q = W_k = W_v = I$ 的一个特殊情况。我们把这样一个自注意力层 + Q，K，V 分别的线性变换操作合称为一个“单头注意力”。

<figure markdown=1>
![IMG_2893](https://markdown-img-1304853431.file.myqcloud.com/IMG_2893.jpg)
<figcaption> Fig 6. 单头注意力模型由一个自注意力层与三个对输入的线性变换构成</figcaption>
</figure>

将多个单头注意力合并在同一层上，就形成了一个“多头注意力层(Multi-head Attention)”。 理论上，多头注意力中的每一个自注意力层会学习到不同的权重参数，从而提高编码器的表达力。

<figure markdown=1>
![IMG_F444A7C83CF2-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_F444A7C83CF2-1.jpeg)
<figcaption> Fig 7. 多头注意力由多个单头注意力堆叠而成 </figcaption>
</figure>

## 3 Transformer 的结构

### 3.1 编码器 Encoder

在 Transformer 中，一个编码器模块由一个多头注意力与一个前馈网络构成。前馈神经网络会单独处理多头注意力的每一个输出 token。

<figure markdown=1>
![IMG_CE1493F0D6C6-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_CE1493F0D6C6-1.jpeg)
<figcaption> Fig 8. Transformer 中的每一个解码器模块都由两个部分构成，两个部分各司其职。同时，模块内部的组件之间有 Shortcut Connection 保证梯度的传递</figcaption>
</figure>

这样，在解码器的每一个模块中其实对输入信息做了两步处理：

1. 将输入的 tokens 通过多头注意力“混合”起来，使得每一个输出token都得到了所有输入中所需的信息

2. 将“混合”后的 token 通过前馈神经网络进行特征提取，对每一个 token 进行真正的“解读”

与此同时，作者为了防止重复堆叠编码器模块导致梯度消失/爆炸，模仿 ResNet 的做法在每一个模块的两个组件之间都添加了短路连接来帮助梯度反向传播。

在输入序列进入堆叠的编码器模块前要先经过词嵌入层与位置编码层。词嵌入层通过类似查表的方式将自然语言输入转化为 $\mathbb{R}^n$ 向量空间中可以计算的向量形式。位置编码层则将输入token之间的**绝对位置关系**通过加法的形式写入到token中传递给编码器。

<figure markdown=1>
<img src="https://markdown-img-1304853431.file.myqcloud.com/IMG_0D1DA4A8EBFD-1.jpeg" style="width: 50%;"/>
<figcaption> Fig 9. Transformer 的编码器结构</figcaption>
</figure>

### 3.2 解码器 Decoder

Transformer 的解码器与编码器类似，也由重复堆叠的解码模块构成。每一个解码模块的结构如下

<figure markdown=1>
<img src="https://markdown-img-1304853431.file.myqcloud.com/IMG_B6E42D58B414-1.jpeg" style="width: 80%;"/>
<figcaption> Fig 10. Transformer 的解码模块中有一个 Masked Multi-head Attention，一个 Multi-head Attention 和 前馈神经网络</figcaption>
</figure>

在解码器中出现了一个之前没有提及的“Masked Multi-head Attention”。这里的“Masked”指的是加在原始注意力权重 $g(q, k)$ 上的一个矩阵。

<figure>
<img src="https://markdown-img-1304853431.file.myqcloud.com/20220111153841.png" style="width: 33%"/>
<figcaption> Fig 11. Masked Multihead Attention 的计算图，可以看到遮罩是放在 Q，K 的运算结果（原始注意力权重）上的</figcaption>
</figure>

这个遮罩可以防止解码器利用“未来”的信息。比如解码器已经输出了 “I / am / fine / .”，我们现在将这些token输入到解码器中，让解码器预测下一个token。由于解码器输出 "I" 的时候 "am / fine / ." 还没有生成，I 和这些 token 没有关系。通过遮罩，我们可以“手动”将这些没有因果关系的注意力权重设置为0.

<figure>
<img src="https://markdown-img-1304853431.file.myqcloud.com/IMG_80BF9CA01C03-1.jpeg" style="width: 50%"/>
<figcaption> Fig 12. Masked Multihead Attention 中，我们可以用遮罩手动，显式的移除这个 token 与解码器在未来的输出之间的关系</figcaption>
</figure>

### 3.3 整体

将编码器与解码器合并起来，我们就的到了 Transformer 的模型：

![IMG_B24E2B3D67CF-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_B24E2B3D67CF-1.jpeg)

## 4 参考来源 Sources

* [Attention is All You Need](https://arxiv.org/abs/1706.03762)

* [CMU 11-785 21 Fall Lecture 19: Transformer & GNN](https://mediaservices.cmu.edu/media/Deep+Learning+%28Fall+2021%29_Introduction+to+Transformers/1_49anpe1e/223190053)

* [Illustrated Guide to Transformers Neural Network](https://towardsdatascience.com/illustrated-guide-to-transformers-step-by-step-explanation-f74876522bc0)

* [Stack Overflow - How to Understand Masked Multi-head Attention in Transformer](https://stackoverflow.com/questions/58127059/how-to-understand-masked-multi-head-attention-in-transformer)

* [Stack Overflow - Difference between Self-attention and Fully Connection Layer](https://stackoverflow.com/questions/64218678/whats-the-difference-between-self-attention-mechanism-and-full-connection-l)
