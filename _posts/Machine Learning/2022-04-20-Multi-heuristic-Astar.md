---
layout: post
title: A* Search and its Variants
tags: [ "Machine Learning", "Notes" ]
category: [ "Machine Learning"]
---

Let $g(s)$ denote the cost of a least-cost path from $s_{start}$ to $s$, we then have
$$
g(s) = \min_{s'\in pred(s)}{(g(s') + c(s', s))}
$$
That is, the minimum cost from $s_{start}$ to $s$ equals to the min cost to get to the predecessor of $s$ (a.k.a. $s’$ in the formula above) add the actual cost from $s’$ to $s$.

## A\* Search

> :package: A\* Search is guaranteed to **Return an optimal path**
>
> Perform **minimal number of state expansions** required to guarantee optimality.

The predicted cost to get from $s_{start}$ to $s_{goal}$ through state $s$ can be estimated through
$$
f(s_{start}, s, s_{goal}) = g(s_{start}, s) + h(s, s_{goal})
$$
$g$ represents the **actual** minimum cost of getting to $s$ from the starting state. $h$ represents a **heuristic estimation** of cost to get to $s_{goal}$ from $s$.

### Requirement of Heuristic Function

Heuristic function must be

**Admissible** - The heuristic function must *underestimate / accurately predict the cost*.
$$
h(s) \leq \min{c(s, s_{goal})}
$$
**Consistent** - the function $h$ should satisfy the triangle inequality.
$$
h(s_{goal}, s_{goal}) = 0,\quad h(S) \leq c(s, s') + h(s')
$$

<mark>A consistent heuristic function $h$ must be admissible.</mark>

## Multi-goal A\* Search (With Imaginary Goal State)

When there are multiple goals, we can construct an *imaginary goal* in the graph that connects all goals.

![IMG_C066319B49CB-1](https://markdown-img-1304853431.file.myqcloud.com/IMG_C066319B49CB-1.jpeg)

If goals have different weights (we have preference to certain goal over others), we can adjust the weights of edge between each goal state to `Imaginary Goal` state.

## Weighted A\* Search

> :package: The weighted A\* allow us to get sub-optimal result with less state expansion, which consumes less memory and computation time.

The scale of explored nodes in A\* search is much smaller than in the dijkastra algorithm. This is because $f(s) = h(s) + g(s)$ provides two constraints on the nodes to explore.

However, for high dimensional graph, the algorithm will soon out of memory. We need some stronger constraint to the expansion of nodes. **Weighted A\***, is one of the algorithm that apply a stronger constraint on expansion, with the cost of losing optimality of A\* search.

Instead of using $f(s) = h(s) + g(s)$, the weighted A\* puts a weight $\epsilon$ on heuristic function
$$
f(s) = g(s) + \epsilon h(s)
$$
This will make the algorithm has more **bias towards states that are closer to goal.**

**Definition ($\varepsilon$-suboptimal)** $cost(solution) \leq \varepsilon\cdot cost(optimal\;solution)$

## Common Heuristic Functions

| Heuristic Function | Equation                                               |
| ------------------ | ------------------------------------------------------ |
| Euclidean Distance | $h(x, y) = \sqrt{(x - x_{goal})^2 + (y - y_{goal})^2}$ |
| Manhattan Distance | $h(x, y) = abs(x - x_{goal}) + abs(y - y_{goal})$      |
| Diagonal Distance  | $h(x, y) = max(abs(x - x_{goal}), abs(y - y_{goal}))$  |

> These heuristic functions are both **consistent** and **admissible**.

---

## :zap: Useful Properties of Heuristic Functions

1. If $h_1(s)$, $h_2(s)$ are consistent, then - $h(s) = \max(h_1(s), h_2(s))$ is also consistent.

2. If A\* uses $\varepsilon$-consistent heuristics
    $$
    \forall s\neq s_{goal}\quad h(s_{goal}) = 0 \wedge h(s) \leq \varepsilon c(s, succ(s)) + h(succ(s))
    $$
    then A\* is $\varepsilon$-suboptimal
    $$
    Cost(solution) \leq \varepsilon \cdot Cost(optimal\;solution)
    $$

3. Weighted A\* with $f(s) = g(s) + \varepsilon h(s)$ is A\* with $\varepsilon$ -consistent heuristics.

4. $h_1(s)$, $h_2(s)$ are both consistent, then $h_1(s) + h_2(s)$ is $\varepsilon$-consistent.

    :question: what is $\varepsilon$ here? There is no such variable in the $h_1$ and $h_2$...

## Why we Need Multiple Heuristic?

> :package: Can we use a bunch of **inadmissible heuristics simultaneously** while preserving guarantees on completeness and bounded sub-optimality?

To solve real-world problem with high DoF robots, we need to use a series of **arbitrary, inadmissible** heuristic functions! How can we reach this result ...? :drum::drum::drum: ***Multi-heuristic A\*!***

**Why not taking `max` directly?**

1. Information is lost when using `max` function
2. Creates local minima inside the search space
3. Requires all heuristics to be admissible :arrow_left: *this is a real problem*

## Multi-Heuristic A\* Search

### Version 1 - Parallel A\*

Run $N$ independent, inadmissible A\* searches. If one of them find the solution, then the whole algorithm finds the solution.

### Version 2 - Shared A\* Search

Share information between searches

> Share the `Open` and `Closed` between algorithms. When one search algorithm adds a node into `Open`, add to other algorithm’s `Open` as well.

Such shared information have several advantages:

1. Different inadmissive A\* search algorithms can *help each other* to get out the local minimas.
2. Since the `Closed` are also shared between algorithms, states are expanded at most **once** across ALL searches

Yet, there are still some problems:

1. No completeness guarantees or bounds on solution quality.

### Version 3 - Anchor Search

Search with admissible heuristic function to **control expansions**.

> :package: In this way, the algorithm is **complete** and **provide bounds on solution quality**.

The A\* that use admissible heuristic function is called `Anchor Search`.

<img src="https://markdown-img-1304853431.file.myqcloud.com/Screen%20Shot%202022-03-15%20at%2022.49.22.png" alt="Screen Shot 2022-03-15 at 22.49.22" style="zoom: 25%;" />

The `Anchor` search can help ensure the completness of multi-heuristic A\*.