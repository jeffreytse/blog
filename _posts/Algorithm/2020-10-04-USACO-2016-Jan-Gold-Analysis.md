---
layout: post
title: USACO 2016 Jan Gold Analysis
tags: [ "Algorithm" ]
category: [ "Computer Science" ]
---

## Problem 1. Angry Cows

### Question Summary

[Link to Question](http://usaco.org/index.php?page=viewproblem2&cpid=597
)

The $N$ hey are on a line, with position $x_1, x_2, \cdots, x_N$. If the cow is shoot to position $x$ with force $R$, then all the cows in range $x \pm R$ will explode. The hey exploded will have a range of $x' \pm (R - 1)$, the second round of hey exploded will have a range of $x'' \pm (R-2)$, and so on.

The question requires the **minimum** power $R$ with one-decimal accuracy that will let all hey on the line explode.
$$
2 \leq N \leq 50,000 \quad \quad \quad \forall n, 0 \leq x_n \leq 1,000,000
$$

### Proposed Solution 

**Binary Search**

There exists an $r'$ such that for all $R>r'$  , all the hey on the line will explode, so it is possible to use binary search in this question.

Storing all the positions $x_1$ to $x_n$ in a list, we can construct two pointers that represents the "frontier" of explosion.

```python
positions = [x1, x2, ..., xn]
p1, p2 = None, None
```

For each explosion, we can use a time complexity of $O(1)$ to update the pointer's position.

```python
def updatePosition(p1, p2, R):
    if positions[p1-1] - positions[p1] <= R:
        p1 -= 1
    if positions[p2 + 1] - positions[p2] <= R:
        p2 += 1
    return p1, p2, R - 1
```

Therefore, it will take time of $O(n)$ for us to simulate one case.

*One optimization is to stop the simulation immediately and return `false` if the chain reaction stop*

If we try all the possible starting point, the total time complexity will be $O(n^2\log{n})$ and it will lead to TLE for Python.

Noticing for all possible starting points, given a fixed force $R$, if starting at $x_i$ can lead a chain reaction that explode all, we note as `true`, otherwise, `false`, the resulting simulation result should look like this:

```
Propagate_Leftward: [True, True, ..., True, True, True, False, ..., False]
Propagate_Rightward: [False, False, ..., False, True, True, ..., True]
Can_Explode_All = Propagate_Left and Propagate_Right
```

We can use a binary search to find the starting point as well.

```python
def findStartLeft(l, r, R):
    # return True if current R can lead to a chain reaction
    m = (l + r)/2
    if l <= r:
        if explodePropagateLeft(l): return l
        else: return -1
    if explodePropgateLeft(m): return findStartLeft(m, r, R)
    else: return findStartLeft(l, m-1, R)

def findStartRight(l, r, R):
    m = (l + r)/2
    if l <= r:
        if explodePropagateRight(l): return l
        else: return -1
    if explodePropgateRight(m): return findStartRight(l, m, R)
    else: return findStartRight(m+1, r, R)

def isValid(l, r, R):
    return findStartLeft(l, r, R) <= findStartRight(l, r, R)
```

By using nested binary search, the time complexity can be reduced to $O(n\log{n}\log{n})$

### Time Complexity Analysis

With time complexity of $O(n \log{n}\log{n})$ and $n < 50,000$, the approximate steps it need is $50,000 \times 16\times 16 = 1.3\times 10^7$ (Consider that we are performing two binary search to determine the existence of starting point, the actual computation step should multiply with factor of $2$, which is approx. $2.6\times 10^7$), which is an acceptable computational time complexity for Python 3.

---

## Problem 2. Radio Contact

[Link to Question](http://usaco.org/index.php?page=viewproblem2&cpid=598)

### Question Summary

Farmer and Bessie are in a two-dimension space with size $1000\times 1000$. Farmer start at $f_x, f_y$, while Bessie start at $b_x, b_y$. ($0 \leq f_x, f_y, b_x, b_y \leq 1000$)

Farmer will walk on a path of length $M$, which has "N", "W", "E", "S" in the path and Bessie will walk on a path of length $N$, which has "N", "W", "E", "S" in it. $0 \leq M, N \leq 1000$

At each tick, either Farmer or Bessie can choose to stay at current position. A radio that consumes energy of $\text{Distance}(Farmer, Bessie)^2$  will remain open until both farmer and Bessie finish their path. **What is the minimum energy the radio will cost**?

### Proposed Solution

This question can be solved using Dynamic Programming.

Build up a table with size $M \times N$ called $E$. $E[m][n]$ represent the **minimum energy radio has consumed** after farmer takes $m$ moves and Bessie takes $n$ moves. Since the square of distance is always non-negative, either farmer or Bessie (or both) will have to take one step in one tick. Therefore, the result at $E[m][n]$ can be used to calculate $E[m + 1][n]$, $E[m  + 1][n + 1]$ and $E[m][n + 1]$, which represent that Bessie stop, no one stop, and Farmer stop, respectively.

To start at a specific position, say $E[x][y]$ in the table, we must make sure the value on this position is already the minimum energy, which means that $E[x-1][y]$, $E[x-1][y-1]$, and $E[x][y-1]$ has been calculated. Therefore, we should calculate the whole table from top to down, and in each row from left to right.

### Time and Space Complexity Analysis

Calculating the value of adjacent cell in a table will have a time complexity of $O(1)$, and we will have to calculate each cell inside the table, so the total time complexity will be $O(MN) \approx O(N^2)$. Since the upper bound of $N$ is only $1\times 10^3$, we can use Python3 to solve this problem.

To store the result for Dynamic Programming (memorization), we have to build a two-dimensional array with size $1000\times 1000$, and the space complexity should not be a problem.



---

## Problem 3. Lights Out

[Link to Question](http://usaco.org/index.php?page=viewproblem2&cpid=599)

### Question Summary

Bessie is on a vertex of a simple polygon with $n$ vertices. The coordinate of vertices are $(x_1, y_1), \cdots (x_n, y_n)$ listed in a clockwise order. The exit of polygon is located at $(x_1, y_1)$. When the light is out, she forgot which vertex she is on but still remember the whole polygon. By moving clockwise and passing through several edges, she will be able to identify the edge she is on. After she know her position, she will either move clockwise or counter clockwise to get to the nearest exit.

The question asks the **greatest difference** between distance Bessie has to go in dark to exit the polygon and the distance Bessie has to go with lights on to exit the polygon in worst case.

### Sample Case Explanation

![image](https://markchenyutian.github.io/Markchen_Blog/Asset/USACO2016JanGold3_1.png)

### Proposed Solution

The Problem can be divide into two parts:

1. Help Bessie identify its actual position (calculate the length Bessie has to walk clockwise to identify her position)
2. Calculate the shortest distance between an arbitrary vertex on polygon and the exit.

For the **first** part, we can convert the polygon to a string, where A, B, C and D represents four different types of corners, and integer $m$ represent the length of edge.

<img src="https://markchenyutian.github.io/Markchen_Blog/Asset/USACO2016_Jan_Gold3-2.jpg" alt="image2" style="zoom: 33%;" />

For example, the polygon in sample can be represented as

$$
\text{10C1D10A1}
$$

One primitive way to find the shortest unique substring is to maintain a set of pointers, where the pointers represent the starting of one substring that has the same pattern.

> For instance, suppose we have a string "10C1D10A10C10A", when Bessie pass by the first edge, she can get information "10C". At this time, the pointer set will be {0, 8}, since [0:3] and [8:11] are both "10C".
>
> Then, Bessie pass by another edge and get new info "1D",  the pointer set will be reduced to {0}. Since [0 + 3: 0+3+2] is "1D", while "[8+3: 8+3+2]" is "10".

This will have a time complexity of $O(n^2)$.

For the **second** part, we can store a list $\text{Dist}$  where $\text{Dist}[n]$ represent the distance between $n$th vertex and the exit when Bessie moves counterclockwise. Also, we will record the perimeter of whole polygon so that the distance between nth vertex and the exit when Bessie moves clockwise can be calculated using $\text{Perimeter}-\text{Dist}[n]$. This has a time complexity of $O(1)$.

Since we $n$ vertexes to go through, the total time complexity will be $O(n^3)$.

### Time Complexity Analysis

$4\leq N\leq 200$, so time complexity of $O(n^3)$ will only lead to a computational step of at most $1.6\times 10^7$ steps, and this problem can be solved by Python3 with the proposed solution.