---
layout: post
title: MAGC Map Structural Design 
tags: ["Log", "Program Design"]
category: ["Computer Science"]
banner: "/assets/images/banners/MAGCMapBanner.jpg"
---

## About

![561633232066](https://markdown-img-1304853431.file.myqcloud.com/561633232066_.pic_hd.jpg)

This project is one of the HackCMU 2021 projects. The MAGC Map won the **3rd prize** in HackCMU 2021. [DevPost Link](https://devpost.com/software/magc-map?ref_content=my-projects-tab&ref_feature=my_projects)

## What is MAGC Map

The MAGC Map is a non-linear structured knowledge map that support real-time collaboration.

## Technical Details

We use the traditional client/server structure for this project. 

The client will run directly on the browser through JavaScript and maintain the GUI and animation.

The server is written in Flask (Python 3) and store the data

### Page Structure

```
Home Page
  |
  |-- Board 1
  |     |-- Node 1
  |     |-- Node 2
  |     |     |-- Message Block 1
  |     |     |-- Message Block 2
  |     |-- Node 3
  |-- Board 2
  |     |
  ...
```

### Data Structure

Each board is stored as a `json` file in format

```json
{
  "nodes": [
    {
      "id": "string (uuid4)",
      "label": "Label Of Node",
      "styles": {
        "color": "CSS-like color string"
      },
      "block": [
        "content_id1",
        "content_id2"
      ]
    }
  ],
  "edges": [
    {
      "id": "string (uuid4)",
      "from": "nodeID1",
      "to": "nodeID2"
    },
    {
      "id": "string (uuid4)",
      "from": "nodeID1",
      "to": "nodeID2"
    }
  ],
  "contents": {
    "content_id1": {
      "type": "markdown",
      "content": "This is an **Example**."
    },
    "content_id2": {
      "type": "markdown",
      "content": "Another $\LaTeX$ Example."
    }
  }
}
```

### Update Protocol v2

This protocol defines how the client (browser) communicate with the server.

#### Protocol Format

```json
{
    "version": "string (uuid)",
    "operation": "string {ADD, DEL, MOD, SYC, NOP, NEW}",
    "property": "string {node, edge, content}",
    "value": "string",
   	"src": "string [Board Name]"
}
```

#### Protocol Operation Definition

In the following passage, we call `node`, `edge`, `content`

| Operation | Client to Server                       | Server to Client                                             |
| --------- | -------------------------------------- | ------------------------------------------------------------ |
| `ADD`     | Ask server to add a new entity         | Server require Client add new entity                         |
| `DEL`     | Remove an entity from server storage   | Remove an expired entity from Client                         |
| `MOD`     | Modify (overwrite) an entity in Server | Modify (overwrite) an entity in Client                       |
| `SYC`     | Request sync from Server               | Provide later versions to client                             |
| `NOP`     | --                                     | Do nothing, client is already up-to-date                     |
| `NEW`     | Create a new Board                     | Completely Reload the JSON File and refresh all (since client is 100+ version behind server) |

#### Lock System (Conflict Avoiding and Access Control)

![IMG_5725](https://markdown-img-1304853431.file.myqcloud.com/IMG_5725.JPG)

To synchronize the changes between users and resolve conflicts in a relatively simple way, we use **Mutex Locks** on the message block.

This means that each block can have at most one user editing at the same time.

**Step1**   - When user click to 'edit' a block, the client will try to acquire a lock from the server through POST method on route `\lock`.

**Step 1a** - If the lock is successfully acquired, the client will call the function and enable editing that block.

**Step 1b** - If the lock is already occupied, the client will deny the request to edit current message block.

**Step 2**  - When editing, the status of locks are stored on the server. At this time, other other client that tried to acquire the lock will be denied.

**Step 2a** - While editing, the client will send XML Request to 'renew' the lock for every three minutes. The reason to design a 'renew system' is described in detail in step 3a.

**Step 3**  - When the user click 'Finish Edit', the client will update the data to server using Update Protocol. After receiving the update protocol, the server will release the lock of corresponding content block automatically.

**Step 3a** - To avoid the dead lock in case that the user gets off-line before hitting 'Finish Edit'. We specially designed a series of 'renew policy' for lock. For each 5 minutes, the server will scan over all the locks. If any of the lock is not renewed for more than 5 minutes, the lock is released automatically.

#### Synchronize System

![IMG_5731](https://markdown-img-1304853431.file.myqcloud.com/IMG_5731.JPG)

To synchronize the client with the server, we developed a synchronize system that allows **Incremental Update**.

Each time a client send update info to the server through Update Protocol v2, the server will implement the update on server and push the Update Protocol payload into a stack called `cacheStack` with size `100`.

Every minute, the client will send an Update Protocol v2 content to server with operation `SYN`. The current version number is also included in the Update Protocol. The server will have three reactions:

1. If the version number equals to the latest version number on server, the server will return a update protocol with operation `NOP`. This means that the client is already up-to-date and no further action is required.

2. If the version number is smaller than the latest version number on server but bigger than the oldest version number in the `cacheStack`. The server will return a list of Update Protocols in the sequence from old to new. The client will then execute update by processing the Update Protocols sequentially. After all protocols are processed, the client is in sync with the server.

3. If the version number is smaller than the oldest version number in the `cacheStack`, the server will directly return a update protocol with operation `NEW`. In this case, the client will automatically reload the whole window to fetch the whole new `json` file from server.



