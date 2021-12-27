---
layout: post
title: USACO 2016 Feb Gold Analysis
tags: [ "Algorithm" ]
category: [ "Computer Science" ]
---

## Problem 1 Circular Barn

[Link to Question](http://usaco.org/index.php?page=viewproblem2&cpid=621)

### Question Summary

The farmer has a circular barn with room numbered from 1 to $n, 3\leq n\leq 1\times 10^5$ . Each room is connected to the rooms that is adjacent to it, and there has one door in each room opened to outside space. Farmer wants each single cow to stay in one single room. Currently, the cows are staying outside the barn randomly, which means that some door may have multiple cows outside it, or have no cows outside it. The energy cost for each cow is $\text{dist}^2$. The question ask for the minimum energy cost to make each cow stay in each room singly.

### Proposed Solution

Observing the operation, we can notice this truth: **If cow A's destination is after the starting point of cow B, the most energy-saving solution will need to exchange the destination of cow A and B.**

Based on this solution, we can maintain a `queue` to store the starting points of cows. When we meet one empty room, we pop out a cow from the queue and add up the distance square of that cow's moving distance.

By repeating this process all around the circular barn, we can get the minimum energy cost.

When we can always drop down one cow per empty room, the result will be optimized. (Or, one cow will have to move for more than 1 round aside the barn)

The cost of maintaining a queue, using linked list, is $O(1)$ for pop and push operation. Since there will have $n$ cows, the total time complexity will be $O(n)$ for a single starting point.

There are totally $n$ possible starting points, so the total complexity will be $O(n^2)$. This will lead to TLE for the result since there will have approx.  $1\times 10^{10}$ computational steps at most. Therefore, we need to optimize our solution

The main problem in the solution above is that we will have to go through all possible starting point, and this will consume a lot of time.

To minimize the time of try, we can first start at a random position, and note the room number that has maximum number of cows in the queue. Then, we can start directly at that position. This can lower the number of try from $n$ to 2, and the total time complexity will be $O(n)$.

### Time Complexity Analysis

Since $3\leq n\leq 1\times 10^5$, with the time complexity of $O(n)$, we can have at most $1\times 10^6$ computational step and we can AC this problem with Python 3 in the time limit.

---

## Problem 2 Circular Barn Revisited

[Link to Question](http://usaco.org/index.php?page=viewproblem2&cpid=622)

### Problem Summary

The farmer wants to have exactly $r_i$ cows in room $i$, where $0\leq r_i \leq 1\times 10^6$. Although there are $n$ rooms in the circular barn, farmer John only want to open $k$ doors to let cows enter the barn ($1\leq k \leq 7$). All the cows can  ONLY walk clockwise inside the barn. He wants to know the minimum total distance for cows to move after entering the barn.

### Proposed Solution

One method to analyze a problem that has a "circular" structure in it is to discuss the problem in a linear structure, which is obviously easier. Consider there is a line of rooms in the barn, and the cows can only move from left to right. We will soon get some obvious facts:

1. The first door MUST be open on the left-most room, or no cow can arrive at the left-most room.

   ![image1](https://markchenyutian.github.io/Markchen_Blog/Asset/USACO_2016_Feb_2_2.jpg)

2. Suppose a cow enters the barn in door $k-1$, it must arrive its destination before $k$th door, or it can just enter the barn from $k$th door and have less walking distance inside the barn.

   ![image2](https://markchenyutian.github.io/Markchen_Blog/Asset/USACO_2016_Feb_2_1.jpg)

Using these two facts, we can use the dynamic programming to solve the linear barn problem.

Let $T$ represent a table of size $n\times (k-1)$.  The value of $T[n'][k']$ represent the minimum total distance the cow has walked when there's $k'+1$ (since the first door must be open) doors open in the first $n'$ doors. The calculation of table can be represent in this pseudocode:
$$
\begin{aligned}
&\text{each element in }T = \infty\\
&T[0][0] \leftarrow (0, 1)\\
&\text{for }T[i][j] \text{ in } T\\
&\quad \quad\text{if }T[i+1][j+1][0] > T[i][j][0]\\
&\quad \quad \quad \quad T[i + 1][j + 1] \leftarrow (T[i][j][0], 0)\\
&\quad \quad \text{if }T[i][j+1][0] > (T[i][j][0] + T[i][j][1] \times r_{j+1})\\
&\quad \quad \quad \quad T[i][j + 1] \leftarrow (T[i][j][0] + T[i][j][1] \times r_{j+1}, T[i][j][1] + 1)\\
&return\; T[k-1][n]
\end{aligned}
$$
![image3](https://markchenyutian.github.io/Markchen_Blog/Asset/USACO_2016_Feb_2_3.jpg)

Each element in table $T$ is made up of a tuple, where the first element represent the minimum total distance the cow has walked when there's $k'$ doors open in the first $n'$ doors and the second element represent the distance of last opened door to  $n'$th door.

By calculating through this table, we can get the minimum total distance walked when the bar has a start on one specific position with time complexity of $O(nk)$.

Since the whole problem is based on a **circular barn**, we should try all $n$ possible starting points. Therefore, the total time complexity will be $O(n^2k)$.

### Time Complexity Analysis

Since $3\leq n\leq 100$ and $1\leq k \leq 7$, we can know that the whole algorithm will have at most $1\times 10^6$ steps to finish the calculate. Therefore, we can use Python 3 to AC this problem.

---

## Problem 3 Fenced In

### Problem Summary

There's a rectangle with corner $(0,0)$ and $(A, B)$. Farmer John built $n$ vertical fences at $x = a_1, a_2, \cdots a_n$ and $m$ horizontal fences at $y = b_1, b_2, \cdots, b_m$. By doing so, the whole rectangle is divided into $(n + 1)(m + 1)$ grids. Now, the farmer want to connect each grid together by removing some of the fences in the rectangle. What is the minimum distance of fence the farmer has to remove to connect EVERY cell in rectangle?

### Proposed Solution

We can see each cell in the rectangle as a node, while the fences between each cell as a bi-directional weighted edge, where the weight equals to the length of fence between two cells. By doing so, we can see the whole field as a graph.

![image4](https://markchenyutian.github.io/Markchen_Blog/Asset/USACO_2016_Feb_3_1.jpg)

After we see the whole grid as a graph, we can find that the problem simply want us to provide the sum of weights of the **Minimum Span Tree** for the whole graph. Therefore, we can use the greedy algorithm to solve this problem. The pseudocode is shown below

$$
\begin{aligned}
& // \text{Fringe is a Priority Queue that will always output the smallest element in it}\\
&L =0\\
&\text{Connected} = \phi \\
&\text{Fringe} = \{ V_0.allEdges \} \\
&\text{While Fringe is not Empty}\\
&\quad \quad \text{newEdge } \leftarrow \text{Fringe.pop()}\\
&\quad \quad \text{While newEdge.destination } \in \text{Connected}\\
&\quad \quad \quad \quad \text{newEdge }\leftarrow \text{Fringe.pop()}\\
&\quad \quad \text{Fringe }=\text{Fringe } \cup \text{ newEdge.destination.allEdges}\\
&\quad \quad \text{Connected }=\text{Connected }\cup \text{ newEdge.destination}\\
&\quad \quad L \leftarrow L+\text{newEdge.wieght}\\
&return\quad L
\end{aligned}
$$

### Time Complexity Analysis

The time complexity of min-span tree algorithm is $O(E)$, which, in this case, equals to $O(mn)$. Since $0\leq m\leq 2000$ and $0\leq n\leq 2000$, the expected computational steps it will take will be at most $1\times 10^7$. Therefore, it is highly possible that we can use Python 3 to AC this problem.