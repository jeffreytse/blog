---
layout: post
tags: [ "Neural Network", "Optimization" ]
category: [ "Neural Network" ]
title: Batch Normalization 深入浅出
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

## 1 Mini-Batch 增量训练法

在进行神经网络训练的过程中，我们使用以下公式计算神经网络的权重参数梯度

$$
\nabla_{W} L(W) = \frac{1}{N}\sum_{x}{\nabla_{W}C(f(x, W), D(x))}
$$

对于训练集中的每一个数据 $x$，我们都计算出权重参数的梯度，将他们相加后除以$N$得到一个“平均梯度”。

因为（我们假设）**训练集中的数据分布于生产/测试环境一致**，当使用整个训练集的结果进行梯度计算和参数更新时，网络 $f$ 能够更加准确的拟合到完整的目标函数 $D$ 上，而非目标函数 $D$ 一部分特殊的定义域上。

![IMG_B72671CFC736-1](https://markdown-img-1304853431.cos.ap-guangzhou.myqcloud.com/IMG_B72671CFC736-1.jpeg)

<center>Fig 1. 当训练集数据分布与测试集不同时（右图），模型拟合结果会显著降低</center>

然而，这样的参数更新方法虽然能够最大化模型的拟合准确率，由于每次进行参数更新前必须得知训练集中所有的输入 $x$ 对应的损失函数 $C(f(x, W), D(x))$ 和权重梯度 $\nabla_{W}C$，模型的权重更新速度会非常缓慢。

为了解决这个问题，我们可以使用 Mini-batch 增量训练方法。每次我们从一个拥有 $N$ 个数据的训练集中随机，不重复的选择 $B$ 个数据作为一个 Batch。得到这 $B$ 个数据的损失函数和对应的梯度后，我们马上对模型进行一次参数更新。

![IMG_BF395E0F0FEB-1](https://markdown-img-1304853431.cos.ap-guangzhou.myqcloud.com/IMG_BF395E0F0FEB-1.jpeg)

<center>Fig 2. 使用 mini-batch 方法训练的模型更新参数的频率有显著提升</center>

可惜，天下没有免费的午餐，当我们使用 mini-batch 来训练神经网络的时候实际上我们有一个隐含的假设：**mini-batch 中的数据分布于训练集相同**。

**然而这个假设在很多情况下是不成立的**。mini-batch 中的数据可能会出现协方差 (Covariance) - 这样的协方差会导致“最优化模型在当前 mini-batch 上的表现” 这个目标与我们真正的目标 —— “最优化模型在训练集上的表现”之间的偏差。

![IMG_FD5CF492EE8A-1](https://markdown-img-1304853431.cos.ap-guangzhou.myqcloud.com/IMG_FD5CF492EE8A-1.jpeg)

<center>Fig 3. 当我们训练模型时，我们构建的逻辑链条</center>



## 2 什么是 Batch Normalization

## 3 为什么需要 Batch Normalization

## 4 Batch Normalization 的数学推导

