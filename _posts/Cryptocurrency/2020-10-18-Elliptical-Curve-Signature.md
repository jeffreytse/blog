---
layout: post
title: Elliptical Curve Signature Algorithm
tags: [ Cryptocurrency ]
category: [ Math ]
---

在传统的金融模型中，当人们需要在银行等金融机构中创建新的账户时，人们必须提供用于证明其身份的凭证（身份证，护照，etc）。然而，在比特币的新型隐私模型中，虽然每个账户之间的交易记录是公开的，但是账户拥有者的身份确不会被公开。为了防止比特币账户被冒用，比特币交易系统中使用了椭圆曲线签名的机制来确保账户操作者就是账户拥有者。

## 1. 什么是椭圆曲线

拥有这样的解析式的一类曲线被称作椭圆曲线:

$$
y^2 = x^3 + ax + b
$$

这样的曲线拥有这如下图所示的形状：

<img src="https://gitee.com/MarkYutianChen/mark-markdown-imagebed/raw/master/20210502162828.png" style="zoom:50%"/>

这样的曲线有两个非常重要的性质：

1. 椭圆曲线是关于$x$轴对称的
2. 任意一条直线只会与椭圆曲线有不超过3个交点

有了这两个性质，我们可以在椭圆曲线上定义“点乘”和“叉乘”这两种运算

## 2. 椭圆曲线上定义的运算符

### 2.1 椭圆曲线上的加法

假设我们有任意两点 $A,B$在椭圆曲线 $E$ 上，我们可以将两点链接起来得到一条直线，这条直线与椭圆曲线的第三个交点 $-C$ 。这时候，我们将得到的点 $-C$ 关于 $x$轴对称，得到点 $C$。 这样的一串操作可以被记录为 $A + B = C$

如果我们把一次加法操作画在图上，那么 $A + B = C$的计算过程会是下面这样：

<img src="https://gitee.com/MarkYutianChen/mark-markdown-imagebed/raw/master/20210502162831.png" style="width:400px;"/>

从上面的途中，我们可以发现椭圆曲线上的点乘是满足交换律的，因为点 $A,B$ 定义的直线与点 $B,A$ 定义的直线是同一条。

一种特殊的情况是 $A + A$。这样的情况下，我们得到的直线会是椭圆曲线在$A$点上的切线，也就是……

<img src="https://gitee.com/MarkYutianChen/mark-markdown-imagebed/raw/master/20210502162834.png" style="width:400px;"/>

### 2.2 椭圆曲线上的乘法

如果一个椭圆曲线上进行了 $n$ 次$A + A$这样的加法操作，我们可以将其简写为 $A\times n$。例如：$A\times 3$的计算过程可以用这样的几何方法表现出来：

<img src="https://gitee.com/MarkYutianChen/mark-markdown-imagebed/raw/master/20210502162838.jpeg" style="width:400px;"/>

[这个网站](https://andrea.corbellini.name/ecc/interactive/reals-add.html)提供了椭圆曲线加法和乘法的可视化

定义了这两种椭圆曲线上的运算以后，我们下面看看为了在计算机上更好的实现这个函数，我们都做了哪些改进。

## 3. 椭圆曲线的改进

为了在计算机上更准确的处理椭圆曲线，我们对椭圆曲线做了以下这些改进：

1. 因为计算机内存储的浮点数都是精度有限的，为了避免浮点数溢出造成的计算误差，我们把原先定义在实数域上的椭圆曲线离散化到了整数域上
2. 大部分编程语言中，整型变量的大小是有上限的，这个上限由程序分配多少内存来存储一个整型变量所决定，为了避免计算过程中出现过大的值从而导致整型变量溢出，我们通过模运算（取余）的方式人为定义了椭圆曲线的上界，当椭圆曲线的计算结果超出上界时，因为模运算的存在，最终结果会被映射在整型变量能够表达的数值范围中。

所以，一个椭圆曲线是由这些参数所决定的：
$$
E = \text{Elliptical Curve}(p, a, b)
$$
这样的一条椭圆曲线拥有这样的代数表达式：
$$
y^2 \equiv x^3 + ax + b \quad (\text{mod } p)
$$

## 4. 椭圆曲线与身份验证

说了那么多，人们到底是怎么用椭圆曲线进行身份验证的呢？

比特币所使用的椭圆函数签名协议是SECP256K1，这个签名协议中包括了一个椭圆函数 $y^2 =x^3+7$ 和一个起始点 $A$。现在，如果有一个人拥有一个数字$K$，他可以很快的用计算机算出在椭圆函数上的$A\times K$。然而，给定$A\times K$，计算出$K$的值却是几乎不可能的。

这样一个非对称的难度让身份验证变得十分简单，只要私钥$K$的持有者不公开自己手中的私钥，其他人就几乎不可能通过私钥的生成结果$A\times K$逆向获得私钥$K$。

假如Bob要使用椭圆签名函数来验证Alice的身份，在此之前，Bob已经通过公开渠道得知Alice的公钥（椭圆函数计算结果是$Z_A$），Alice也通过公开渠道知道Bob的公钥（Bob用自己的椭圆函数私钥$K_B$计算出的结果$Z_B$）。那么Alice要做的事情就是向Bob传输$K_A \times Z_B$。因为$Z_B$实际上是$A\times K_B$的结果，我们也可以将传输的信息写作$K_A\times K_B\times A$。

当Bob收到Alice发来的$K_A\times Z_B$的结果后，他可以通过计算$Z_A \times K_B$ 并与Alice发出的结果相比对进行验证。如果对面确实是Alice在对账户进行操作，那么应该有$K_A\times Z_B = Z_A \times K_B$。证明如下：

$$
\begin{aligned}
&K_A \times Z_B\\
=&K_A \times A \times K_B\\
=&(K_A\times A)\times K_B\\
=&Z_A\times K_B
\end{aligned}
$$

通过这样的方式，就可以在双方不透露自己私钥的情况下完成身份认证了。

## 5. 比特币交易系统中的椭圆曲线

在比特币的交易系统中，每个用户都会有一个随机生成的私钥，并且用SECP256K1算法计算出自己私钥所对应的公钥，在下面这张描述比特币交易流程的图中，最关键的部分之一就是通过上诉的身份验证算法确定确实是比特币的所有者在进行转账操作。

<img src="https://gitee.com/MarkYutianChen/mark-markdown-imagebed/raw/master/20210502162842.png"/>
