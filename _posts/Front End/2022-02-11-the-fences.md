---
layout: post
title: "The Fences | AR Web Application"
tags: ["Program Design", "Web", "Serverless"]
category: ["Frontend"]
banner: "https://user-images.githubusercontent.com/47029019/152687484-e19fe892-60c9-49de-b4ae-1b0022a683be.jpg"
---

## In a Sentence, What is It? 

Our inspiration came from The Fence at CMU:

By providing a synchronized, immersive AR experience across different platforms, we aim to build a bond between virtual space and physical world, allowing people to share their ideas openly, just like role of The Fence.


## Short Demo

| iOS Application | Web Application |
|-----------------|-----------------|
| <img src="https://user-images.githubusercontent.com/47029019/152687716-21fb26b1-a8f5-4d14-b952-7df44f0b2eaa.gif" style="height: 25rem"/> | ![web-demo-min](https://user-images.githubusercontent.com/47029019/152687732-d309165a-c033-444b-8bb8-8011d533efcf.gif) |

## How We Implement These Magical Apps? (Brief Version)

### Mobile Application

For mobile application, we build upon `AR Kit`, `ML Core` and `Scene Kit`. With `ML Core` recognizing physical environment, `AR Kit` initializing AR space, and `Scene Kit` rendering AR content, our app provide user with a fluent and immersive AR experience.

![Mobile Application](https://markdown-img-1304853431.cos.ap-guangzhou.myqcloud.com/152685412-22d75f03-0385-4552-8917-f785381ffb69.jpg)

### Web Application

For web application, we use the `WebRTC`, `OpenCV` and `WebAssembly` to create a chance to view experience for all mobile users without any need of installing application.

![Web Application](https://markdown-img-1304853431.cos.ap-guangzhou.myqcloud.com/152671055-229ad26c-dadf-4f90-a28b-d92802374c21.jpg)

Specifically, we use the QR Code not only to identify the current board's ID, but also calculate the perspective matrix of current frame and use it to draw AR overlay on browser.

### Serverless Backend

For backend support, we deploy our product on `Firebase` and `Cloud Run` from Google Cloud Platform. The nature of cloud service allow our app to have low latency and high availability across different splatforms.

![Serverless Backend](https://markdown-img-1304853431.cos.ap-guangzhou.myqcloud.com/152683764-030f614c-e7c3-4dc1-8f72-7833ac1443a5.jpg)

## Technical Details - AR Web Application

### Why we call this *Pseudo-AR Experience*?

The special nature of this project (showing AR-like content boards on the wall) makes it possible to create a real-time renderer purely through web technical stack (Javascript and WebAssembly).

Unlike the broad definition of AR objects (which may float in the 3D space around user or some "anchor"), the content we need to render is ensured to stay on a plane. 

### How We Render, Actually?

Since we have an QR Code as anchor (Up-Left corner of content), we can calculate the **perspective transform matrix** using original dimension of QR code and detected contour of QR Code.

As the content is on the same plane as the QR Code, it's safe for us to assume that they share the same perspective transform matrix. Therefore, we can re-apply the resulted transformation on raw image to render it.

![Untitled Notebook-33](https://markdown-img-1304853431.cos.ap-guangzhou.myqcloud.com/152671125-abfa8e38-0c09-423e-8637-7a2328dd5443.jpg)

```javascript
function getPerspectiveMatrix(p1, p2, p3, p4, bboxW, bboxH)
// Originally p1, p2, p3, p4 in QR detected.
{
    let corner1 = new cv.Point(p1.x, p1.y);
    let corner2 = new cv.Point(p2.x, p2.y);
    let corner3 = new cv.Point(p3.x, p3.y);
    let corner4 = new cv.Point(p4.x, p4.y);
    let perspectiveArray = [
        corner1.x, corner1.y, 
        corner2.x, corner2.y,
        corner3.x, corner3.y,
        corner4.x, corner4.y
    ];
    let srcArray = [
        0, 0,
        bboxW, 0,
        bboxW, bboxH,
        0, bboxH
    ];
    let perspectiveMat = cv.matFromArray(4, 1, cv.CV_32FC2, perspectiveArray);
    let srcMat = cv.matFromArray(4, 1, cv.CV_32FC2, srcArray);
    T = cv.getPerspectiveTransform(srcMat, perspectiveMat);
    srcMat.delete(); perspectiveMat.delete();
    return T;
}
```

```javascript
function renderPerspective(p0, p1, p2, p3, bboxW, bboxH) {
    let boardMat = undefined;
    if (isLoaded(document.getElementById("board-src"))){
        boardMat = cv.imread("board-src");
    } else {
        boardMat = cv.imread("loading");
    }
    T = getPerspectiveMatrix(p0, p1, p2, p3, bboxW, bboxH);
    let perspectiveMat = new cv.Mat(boardElem.height, boardElem.width, cv.CV_8UC4);
    let dsize = new cv.Size(overlayElem.width, overlayElem.height);
    cv.warpPerspective(
        boardMat, perspectiveMat, T, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar()
    );
    cv.imshow(overlayElemID, perspectiveMat);
    boardMat.delete(); T.delete(); perspectiveMat.delete();
    calculateRatio();
}
```

By laying the original video, rendered output canvas, and HTML Document Elements in a stack, we can create a *pseudo-AR* experience for users, **even when their device does not support standard WebXR APIs**.

![Untitled Notebook-27](https://markdown-img-1304853431.cos.ap-guangzhou.myqcloud.com/152671154-8bd10367-223d-455e-b1f5-823ea3a3d4d0.jpg)


When a new detection result arrives, in two cases we don't need to update our render result:

1. No QR Code is detected at this frame (the QR Detector occationally miss QR codes in view) **Countinuity Enhancement Intervened**
2. The new perspective matrix is almost the same as previous one **Stability Enhancement Intervened** 

### Continuity Enhancement

The `barcodeDetector` provided by Chrome is fast, but also unstable. Minor change in perspective or camera position may lead to a loss of 1-2 frames of detection result.

When there are only 1-2 frames with no QR code is detected, the renderer will Not clear the canvas at once. Instead, it will begin to count the number of frame without QR detection result. If the counter reach 10, the canvas will then be cleared. This can greatly relief the flickering problem in AR Content.


### Stability Enhancement

If we render every frame based on the result of QR Scanner directly, the content will be highly unstable and have poor user experience.

| Before Stabilization | After Stabilization |
|----|----|
|![BadExample-min](https://user-images.githubusercontent.com/47029019/152672103-b7260f7c-171b-4b82-894c-69c18187a250.gif)|![GoodExample-min](https://user-images.githubusercontent.com/47029019/152672171-288b6b09-8fe7-4a75-8b52-c317f3769cdb.gif)

When the new QR Code `P1` is within three pixels away from previos detection result (`P1'`), we will NOT update the AR Render. This can minimize the "shaking" of AR content, and provide a better user experience.

| Illustration | Explaination |
|----|----|
|![illustration](https://user-images.githubusercontent.com/47029019/152673584-0124049d-506e-456f-802f-09d08c06fbe7.jpeg)| If the black square is detection result at frame `t`, the AR content will be re-rendered only in case of green frames. If the detection result at `t + 1` is the red bounding box, then AR content will NOT be re-rendered.|

