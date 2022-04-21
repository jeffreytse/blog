---
layout: post
title: 算法的时间复杂度 | Time Complexity and Asymptotic Notation
tags: [ "Algorithm" ]
category: [ "Algorithm" ]
---

## Why we need Asymptotic Notation

In most of the time, we don't need to calculate the exact computational time for a given algorithm.
For an input that is large enough, the coefficient on the lowest term will have little effect on the overall computational time for the whole algorithm. Therefore, the main trend of computational time is determined by the highest term of the polynomial.

When we are focusing on how the computational time increases as the scale of input increase, we are calculating the Asymptotic Efficiency of algorithm.

What we do concern is how the running time of algorithm increase as the scale of input increase. In this case, we need to employ the asymptotic notation to help us analyze the time complexity of algorithm.

## $\Theta (g(n))$ | Big-Theta Notation
This notation represents a set of functions that has a **tight** upper bound and lower bound. If a function $f(x)$ is in the set $\Theta (g(n))$, then we know that there exists $n_0$, $c_1$, and $c_2$ such that

$$
c_1 \cdot g(n) \leq f(n) \leq c_2 \cdot g(n) \quad \forall n \geq n_0
$$


## $O(g(n))$ | Big-O Notation
This notation represents a set of functions that has a specific upper bound. If a function $f(x)$ is in the set $O(g(n))$, then we know that there exists a $n_0$ and $c$ such that

$$
0\leq f(n)\leq c\cdot g(n) \quad \forall n \geq n_0
$$

Since the big O notation only specify the upper bound of function, it is a much bigger set than big theta notation. Which means that $\Theta(n) \subseteq O(n)$.

## $\Omega(g(n))$ | Big-Omega Notation
This notation represents a set of functions that has a lower bound. For all function in the set $\Omega(g(n))$, it must satisfy that there exist $c$ and $n_0$ such that

$$
c\cdot g(n) \leq f(n) \quad \forall n \geq n_0
$$


## Amortized Analysis of Time Complexity

The **Amortized Analysis of Time Complexity** is the calculation of average time complexity of an operation.

Example: In Java, the `arrayList` item is in fact a `array`. When it is full, it will copy the elements from original array into a new array with length 1.5 times the original one.

Though it seems to be inefficient and may have a time complexity of $O(n)$ for some situation, the **Average time complexity** of adding an item into the `arrayList` is still $O(1)$.

Suppose reading & writing one element in an array will take time of $c$. Constructing an array of length $n = 1.5^m \cdot k$ will take:

$$
\begin{aligned}
T(n) &= \underbrace{2\sum_{i = 0}^{m}{(1.5)^ik\cdot c}}_{\text{Copy element across arrays}} + \underbrace{(1.5)^m kc}_{\text{Add element into last array}} \\
&= 2ck\cdot \frac{1 - 1.5^m}{1 - 1.5} + 1.5^m kc\\
&= -4ck + 4ck(1.5)^m + (1.5)^m kc\\
&= O(1) + O(n) + O(n)\\
&= O(n) 
\end{aligned}
$$

Therefore, on average, the time it takes to add one element in the array will be $O(1)$.