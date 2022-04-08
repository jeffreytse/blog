---
layout: post
title: Embeddable Clac Execution Environment
tags: ["Web", "React"]
category: ["Frontend"]
---

## Demo

An open-to-use, embeddable clac execution implemented with `React` and `TypeScript`. You can try it below!

For example, try to input the instruction `: square 1 pick * ; 2 square print` into the wedget below and see what will happen!

<div id="claculator-interactive" data-mode="embeddable"></div>

## About This Project

This is an attempt to build interactive web-based runtimes of a toy language used in *15-122 Principle of Imperative Computation*, `Clac`,  with TypeScript and React. You can find the source code at [https://github.com/MarkChenYutian/TypeScript-Claculator](https://github.com/MarkChenYutian/TypeScript-Claculator).

## So Cool! How Can I deploy it on my site?

Download the `index.min.js` file from [Here]({{ site.baseurl }}/apps/clac/index.min.js), link it to your webpage with

```html
<!-- Place this line at the end of your page -->
<script src="<your-installation-dir>/index.min.js"></script>
```

Then, at where you want to insert the widget, insert this line:

```html
<div id="claculator-interactive" data-mode="embeddable"></div>
```

## About The Clac Language

![Screen Shot 2022-04-05 at 21.10.44](https://markdown-img-1304853431.file.myqcloud.com/Screen%20Shot%202022-04-05%20at%2021.10.44.png)

Notes\*:

1. The `print` token causes 𝑛n to be printed, followed by a newline.
2. The `quit` token causes the interpreter to stop.
3. This is a 32 bit, two’s complement language, so addition, subtraction, multiplication, and exponentiation should behave just as in C0 without raising any overflow errors.
4. Division or modulus by 0, or division/modulus of `int_min()` by -1, which would result in an arithmetic error according to the definition of C0 (see page 4 of the [C0 Reference](https://c0.cs.cmu.edu/docs/c0-reference.pdf)), should raise an error in Clac. Negative exponents are undefined and should also raise an error.
5. The `pick` token should raise an error if 𝑛n, the value on the top of the stack, is not strictly positive. The `skip` token should raise an error if 𝑛n is negative; 0 is acceptable.

**\* Notes of Notes: Since we are implementing its core with `JavaScript`, some specific numerical calculation may not match the original, `C0` version's result.**


<script src="{{ site.baseurl }}/apps/clac/index.min.js"></script>
