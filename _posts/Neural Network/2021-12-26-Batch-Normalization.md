---
layout: post
tags: [ "Neural Network", "Optimization" ]
category: [ "Neural Network" ]
title: Batch Normalization 浅入深出
banner: "/assets/images/banners/FunctionBackground.jpg"
---

## 0 符号表

| 符号          | 意义                                                         |
| ------------- | ------------------------------------------------------------ |
| $\nabla_{W}f$ | 函数 $f$ 关于变量（集合）$W$ 的梯度                          |
| $N$           | 训练集中数据总量                                             |
| $C$           | 损失函数（Cost Function），对于给定模型输出 $\hat{y}$ 与目标输出 $y$ 进行差距评估 |
| $f(x, W)$     | 拥有权重参数 $W$ 神经网络对于输入 $x$ 的输出                 |
| $D$           | 目标函数（Ground Truth）                                     |
| $X$           | 训练数据集                                                   |
| $X’$          | 训练数据集中的一个 mini-batch， $X’\subseteq X$              |

## 1 Mini-Batch 增量训练法与协方差问题

在进行神经网络训练的过程中，我们使用以下公式计算神经网络的权重参数梯度

$$
\nabla_{W} L(W) = \frac{1}{N}\sum_{x}{\nabla_{W}C(f(x, W), D(x))}
$$

对于训练集中的每一个数据 $x$，我们都计算出权重参数的梯度，将他们相加后除以$N$得到一个“平均梯度”。

因为（我们假设）**训练集中的数据分布于生产/测试环境一致**，当使用整个训练集的结果进行梯度计算和参数更新时，网络 $f$ 能够更加准确的拟合到完整的目标函数 $D$ 上，而非目标函数 $D$ 一部分特殊的定义域上。

![IMG_B72671CFC736-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_B72671CFC736-1.jpeg)

<center>Fig 1. 当训练集数据分布与测试集不同时（右图），模型拟合结果会显著降低</center>

然而，这样的参数更新方法虽然能够最大化模型的拟合准确率，由于每次进行参数更新前必须得知训练集中所有的输入 $x$ 对应的损失函数 $C(f(x, W), D(x))$ 和权重梯度 $\nabla_{W}C$，模型的权重更新速度会非常缓慢。

为了解决这个问题，我们可以使用 Mini-batch 增量训练方法。每次我们从一个拥有 $N$ 个数据的训练集中随机，不重复的选择 $B$ 个数据作为一个 Batch。得到这 $B$ 个数据的损失函数和对应的梯度后，我们马上对模型进行一次参数更新。

![IMG_BF395E0F0FEB-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_BF395E0F0FEB-1.jpeg)

<center>Fig 2. 使用 mini-batch 方法训练的模型更新参数的频率有显著提升</center>

可惜，天下没有免费的午餐，当我们使用 mini-batch 来训练神经网络的时候实际上我们有一个隐含的假设：**mini-batch 中的数据分布于训练集相同**。

$$
\text{argmin}_{W}{\left(
	\sum_{x\in X'}{C(f(x, W), D(x))}
\right)}

\Leftrightarrow 

\text{argmin}_{W}{\left(
	\sum_{x\in X}{C(f(x, W), D(x))}
\right)}
$$

上面这两个最优化目标只有在 $X’$ （Mini-batch 中的数据） 与 $X$ （Training Set 中的数据） 的数据分布一致时才是一致的。

**然而这个假设在很多情况下是不成立的**。mini-batch 中的数据可能会有较大的协方差 (Covariance) - 也就是说，当前 mini-batch 的数据分布与训练集的数据分布并不相同。

数据分布的差异会导致模型在优化权重参数时的目标 “最优化模型在当前 mini-batch 上的表现” 这个目标与我们真正的目标 —— “最优化模型在训练集上的表现”之间的偏差。

![IMG_FD5CF492EE8A-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_FD5CF492EE8A-1.jpeg)

<center>Fig 3. 当我们训练模型时，我们构建的逻辑链条</center>

## 2 Batch Normalization 理论

为了解决这个问题，Sergey Ioffe 和 Christian Szegedy 在 2015 年提出了 Batch Normalization （下文简称BN）的方法。BN 的理解实际上很简单 - 我们可以将所有的 mini-batch 移动到一个特殊的位置 ($\mu = 0$, $\sigma =1$)，来“正则化（Normalize）” mini-batch，让所有的 mini-batch 拥有一致的数据分布。

然而，如果 BN 只有这一步，我们会不可避免的丢失数据本身的部分信息 - 训练集本身的平均值与方差。对于一个训练集 $X$，我们可以求出其平均值 $\mu_X$ 与方差 $\sigma_X$。这两个数据本身也是数据集的信息之一。

为了解决这个问题，我们要向BN中添加两个**可训练的参数** $\gamma$ 与 $\beta$。在将mini-batch正则化后，我们通过计算 $\gamma x + \beta$ 把所有的 batch 统一移动到 $\mu = \beta$，$\sigma = \gamma$ 的位置。

![image-20211227115058717](https://markdown-img-1304853431.file.myqcloud.com/image-20211227115058717.png)

<center>Fig 4. Batch Normalization 的正则化过程可以分为三步：1. Centering （$\mu=0$）2. Scaling ($\sigma = 1$) 3. Moving （$\mu = \beta$, $\sigma = \gamma$)
</center>

通过BN的操作，我们可以尽可能减小 mini-batch 中数据分布与训练集的不一致性，a.k.a mini-batch 的协方差。

## 3 Batch Normalization 实现

![image-20211227123210186](https://markdown-img-1304853431.file.myqcloud.com/image-20211227123210186.png)

<center>Fig 5. 一个使用了BN的神经元，可以看到BN实际上是在每个神经元中对输入加权&amp;偏置的值进行正则化</center>

可以将 BN 看作插入在神经元中的一个中间件。图5中的蓝色变量都是神经网络 $f(x, W)$ 中可训练的参数集合 $W$ 中的变量。如果我们用计算图的形式表现变量之间相互依赖的关系，我们会得到下面这样一张计算图：

<img src="https://markdown-img-1304853431.file.myqcloud.com/IMG_4E0BC0496AB3-1.jpeg" alt="IMG_4E0BC0496AB3-1" style="zoom: 33%;" />

其中，我们有

$$
\mu_B = \frac{1}{B}\sum_{i=1}^B{z_i}
$$

$$
\sigma^2_B = \frac{1}{B}\sum_{i=1}^B{(z_i - \mu_B)^2}
$$

$$
u_i = \frac{z_i - u_B}{\sqrt{\sigma^2_B + \epsilon}},\quad\text{Where }\epsilon\text{ is a smooth factor}
$$

$$
\hat{z}_i = \gamma u_i + \beta
$$

## 4 Batch Normalization 反向传播数学推导

> Adapted from CMU 11785 Lecture 8 Notes

假设我们现在已知 $\nabla_{\hat{z}} C(f(x, W), D(x))$，我们希望让这个梯度通过含有 Batch Normalization 的神经元，反向传播到 $\nabla_x C(f(x, W), D(x))$，那么我们需要计算 $\frac{\partial C}{\partial x_1}$，... ，$\frac{\partial C}{\partial x_n}$。

根据偏微分的链式法则，我们知道

$$
\frac{\partial C}{\partial x_1} = \sum_{i=1}^{n}{\frac{\partial C}{\partial \hat{z}_i}\frac{\partial \hat{z}_i}{\partial x_1}}
$$

不失一般性的，因为在神经元的计算中，每一个 $x$ 分量的计算都是相同的，我们可以通过计算 $\frac{\partial C}{\partial x_1}$得出计算 $\frac{\partial C}{\partial x_i}$ 的通项公式。所以在下文中，我们会以计算 $x_1$ 的梯度为例子进行计算与推导。

因为从 $u_i$ 开始，向量中的每个分量都是单独计算的，我们可以得知对于任意 $i\neq j$，我们有 $\partial \hat{z}_i /\partial u_j = 0$：

$$
\frac{\partial C}{\partial u_i} = \sum_{j=1}^n{\frac{\partial C}{\partial \hat z_j}\frac{\partial \hat z_j}{\partial u_i}} = \frac{\partial C}{\partial \hat z_i}\frac{\partial \hat z_i}{\partial u_i} = \frac{\partial C}{\partial \hat z_i}\cdot \gamma
$$

### 4.1  BN中的直接连接反向传播公式推导

重新回顾一下之前的BN计算图，我们不难发现 $z_1$ 的值计算到 $u_1$ 有三条不同的路线。我们需要计算 $\partial {u_i}/{\partial z_i}$ 时，需要计算三条路线上的微分并相加起来。

<img src="https://markdown-img-1304853431.file.myqcloud.com/IMG_614F94CA4D21-1.jpeg" alt="IMG_614F94CA4D21-1" style="zoom:25%;" />

$$
\frac{\partial u_1}{\partial z_1} = \frac{\partial u_1}{\partial z_1} + \frac{\partial u_1}{\partial \mu_B}\frac{\partial \mu_B}{\partial z_1} + \frac{\partial u_1}{\partial \sigma^2_B}\frac{\partial \sigma^2_B}{\partial z_1}
$$

对于上式**第一项（计算图中的黑色路线）**，$\partial u_1/\partial z_1$，这里的直接连接来自于公式

$$
u_i = \frac{z_i - u_B}{\sqrt{\sigma^2_B + \epsilon}}
$$

所以我们可以直接计算出

$$
\frac{\partial u_1}{\partial z_1} = \frac{1}{\sqrt{\sigma^2_B + \epsilon}}
$$

对于**<font color="blue">第二项（计算图中的蓝色路线）</font>**，我们需要分别计算单独一个 $z_1$ 对整个 Mini-batch 的平均数 $\mu_B$ 的偏导数以及平均数 $\mu_B$ 对于BN结果 $u_1$ 的偏导数。

因为我们有

$$
\mu_B = \frac{1}{B}\sum_{i=1}^B{z_i}
$$

不难得出

$$
\frac{\partial \mu_B}{\partial z_1} = \frac{1}{B}
$$

同时，对于 $\partial \mu_B/\partial u_1$，我们有

$$
u_i = \frac{z_i - u_B}{\sqrt{\sigma^2_B + \epsilon}}
$$

所以有

$$
\frac{\partial u_1}{\partial \mu_B} = -\frac{1}{\sqrt{\sigma_B^2 + \epsilon}}
$$

将两个偏导数乘起来，我们就能得到计算图中蓝色路线的反向传播公式：

$$
-\frac{1}{B\sqrt{\sigma_B^2 + \epsilon}}
$$

对于**<font color="purple">第三项（计算图中的紫色路线）</font>**，我们需要分别计算两条“支路”的偏微分之和

$$
\frac{\partial u_i}{\partial \sigma^2_B}\frac{\partial \sigma^2_B}{\partial z_1} = \frac{\partial u_i}{\partial \sigma^2_B}\left(
	\frac{\partial \sigma^2_B}{\partial z_1} + \frac{\partial \sigma^2_B}{\partial \mu_B}\frac{\partial \mu_B}{\partial z_1}
\right)
$$

从 $u_i$ 的计算公式，我们可以得知

$$
\frac{\partial u_1}{\partial \sigma^2B} = \frac{\partial }{\partial \sigma^2_B}\frac{z_1 - u_B}{\sqrt{\sigma^2_B + \epsilon}} = -\frac{z_1 - \mu_B}{2(\sigma_B^2 + \epsilon)^{3/2}}
$$

因为有方差$\sigma_B^2$的计算公式

$$
\sigma^2_B = \frac{1}{B}\sum_{i=1}^B{(z_i - \mu_B)^2}
$$

我们可以得知 $\partial \sigma_B^2 / \partial z_1$

$$
\frac{\partial \sigma_B^2}{\partial z_1} = \frac{\partial }{\partial z_1}\frac{(z_1 - \mu_B)^2}{B} = 2\frac{z_1 - \mu_B}{B}
$$

同时，我们有

$$
\frac{\partial \sigma_B^2}{\partial \mu_B}
 = \frac{1}{B}\sum_{i=1}^B{-2(z_i - \mu_B) = -\frac{2}{B}\left(\sum_{i=1}^B{z_i} - \sum_{i=1}^B{\mu_B}\right)} = 0
$$

因此，计算图中的紫色路线的反向传播公式是：

$$
-\frac{z_1 - \mu_B}{2(\sigma_B^2 + \epsilon)^{3/2}} \cdot 2\frac{z_1 - \mu_B}{B} = -\frac{(z_1 - \mu_B)^2}{(\sigma_B^2 + \epsilon)^{3/2}B}
$$

将三条路线的反向传播公式相加，我们就能得到“直接连接“的反向传播公式

$$
\frac{\partial u_i}{\partial z_i} = \frac{1}{\sqrt{\sigma^2_B + \epsilon}} -\frac{1}{B\sqrt{\sigma_B^2 + \epsilon}} -\frac{(z_1 - \mu_B)^2}{B(\sigma_B^2 + \epsilon)^{3/2}}
$$

### 4.2 BN 中的跨越连接反向传播公式推导

<img src="https://markdown-img-1304853431.file.myqcloud.com/image-20211227162304898.png" alt="image-20211227162304898" style="zoom:25%;" />

对于跨越连接（$\partial u_i/\partial z_j$, where $i\neq j$），计算图中只有蓝色与紫色两条路径，所以我们有

$$
\frac{\partial u_i}{\partial z_j} = \begin{cases}
\frac{1}{\sqrt{\sigma^2_B + \epsilon}} -\frac{1}{B\sqrt{\sigma_B^2 + \epsilon}} -\frac{(z_1 - \mu_B)^2}{B(\sigma_B^2 + \epsilon)^{3/2}} & i=j\\
-\frac{1}{B\sqrt{\sigma_B^2 + \epsilon}} -\frac{(z_1 - \mu_B)^2}{B(\sigma_B^2 + \epsilon)^{3/2}} & i\neq j
\end{cases}
$$
