var BucketName = 'yutian-public';

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:0d7c101f-bcad-4d42-9723-1c7a75792a69',
});

// Create a new service object
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: BucketName}
});

var currentDir = "";

function getPublicObjects(prefix) {
    let output = document.querySelector("div#output");
    removeAllChildNodes(output);
    let waitMsg = document.createElement("center");
    waitMsg.style.cursor = "wait";
    waitMsg.innerText = "Loading files from AWS S3 ...";
    output.appendChild(document.createElement("div"));// Placeholder for the grid
    output.appendChild(waitMsg);

    currentDir = prefix;
    s3.listObjects({Bucket: BucketName, MaxKeys: 100, Prefix: prefix}, 
        function(err, data) {
            if (err) {
                console.log(err);
                // Error Msg on UI
                let output = document.querySelector("div#output");            
                removeAllChildNodes(output);
                let warnMsg = document.createElement("center");
                warnMsg.innerText = "Error: Unable to load Files from AWS S3.";

                output.appendChild(document.createElement("div"));// Placeholder for the grid
                output.appendChild(warnMsg);
            } else {
                renderFiles(data);
            }
    });
}

//////////////// UI Functions 

function reload() { getPublicObjects(currentDir); }

function goHome() { getPublicObjects(""); }

function download(objectKey) {
    s3.getObject({Bucket: BucketName, Key: objectKey}, (err, data) => {
        if (err) {
            console.log(err);
            alert("Failed to retrieve file from AWS S3 Bucket\nContact Mark for further information / maintenance.");
        } else {
            console.log(data);
            // let buffer = new ArrayBuffer(data.ContentLength);
            let blob = new Blob([data.Body.buffer], {type: data.ContentType});
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            let pathParsed = objectKey.split("/");
            link.download = pathParsed[pathParsed.length - 1];
            link.click();
        }
    })
}

/////////////////////////////

function renderFiles(awsData) {
    // Clear output region
    let output = document.querySelector("div#output");
    removeAllChildNodes(output);

    //Add Current Path to display area
    let pathTitle = document.querySelector("h2#app-path");
    pathTitle.innerText = "Shared Files/" + awsData.Prefix;

    // Detect Folders and show result on current path only
    let s = new Set();
    let prefix = awsData.Prefix;

    if (prefix !== "") {
        let elems = renderFolder("..", prefix);
        elems[0].onclick = () => {
            let parsedDir = currentDir.slice(0, currentDir.length - 1).split("/");
            // console.log(parsedDir.slice(0, parsedDir.length - 1).join("/"));    // DEBUG
            getPublicObjects(parsedDir.slice(0, parsedDir.length - 1).join("/"));
        }
        elems.forEach(elem => {output.appendChild(elem);});
    }

    for (let idx = 0; idx < awsData['Contents'].length; idx ++){
        let fileObj = awsData['Contents'][idx];
        let fileObjPath = fileObj.Key.slice(prefix.length).split("/");
        if (fileObjPath.length == 1) {
            let elems = renderFileItem(fileObj, prefix);
            elems.forEach(elem => { output.appendChild(elem); });
        } else {
            s.add(fileObjPath[0]);
        }
    }
    s.forEach(folderName => {
        let elems = renderFolder(folderName, prefix);
        elems.forEach(elem => { output.appendChild(elem); })
    });
    // console.log(awsData);   // DEBUG
}

function renderFolder(folderName, prefix) {
    let children = [
        getFileIconElem({Key: "dummy.folder"}),
        getFileNameElem({Key: prefix + folderName}, prefix),
        document.createElement("div")
    ];
    let rowContainer = document.createElement("div");
    rowContainer.className = "file-row-container";
    rowContainer.onclick = () => {
        // console.log(prefix + folderName + "/"); // DEBUG
        getPublicObjects(prefix + folderName + "/");
    };
    children.forEach(child => {
        rowContainer.appendChild(child);
    });
    return [rowContainer];
}


function renderFileItem(fileObject, prefix) {
    let children = [
        getFileIconElem(fileObject),
        getFileNameElem(fileObject, prefix),
        getFileSizeElem(fileObject)
    ];
    let rowContainer = document.createElement("div");
    rowContainer.className = "file-row-container";
    rowContainer.onclick = () => { download(fileObject.Key); };
    children.forEach(child => {
        rowContainer.appendChild(child);
    });
    return [rowContainer];
}

function getFileNameElem(fileObject, prefix) {
    let obj = document.createElement("div");
    obj.className = "file-name";
    obj.innerText = fileObject.Key.slice(prefix.length);
    return obj
}

function getFileSizeElem(fileObject) {
    let obj = document.createElement("div");
    obj.className = "file-size";
    let size = fileObject.Size / 1024;
    let postfix = ["KB", "MB", "GB"]
    let ptr = 0;
    while (ptr < 3) {
        if (size / 1024 < 1) { break; }
        size = size / 1024;
        ptr += 1;
    }
    size = parseFloat(size + "").toFixed(2);
    obj.innerText = size + " " + postfix[ptr];
    return obj
}

function getFileIconElem(fileObject) {
    let fileType = fileObject.Key.split(".");
    fileType = fileType[fileType.length - 1].toLowerCase();
    let obj = document.createElement("div");
    obj.className = "file-btn";
    switch (fileType) {
        case 'pdf':
            obj.innerHTML = "<i class='fa fa-file-pdf-o' aria-hidden='true' style='color:#F40F02'></i>";
            break;
        case 'folder':
            obj.innerHTML = "<i class='fa fa-folder-open-o' aria-hidden='true' style='color:#FDB900'></i>";
            break;
        case 'py':
            obj.innerHTML = "<i class='fa fa-file-code-o' aria-hidden='true' style='color: #0078D7'></i>";
            break;
        case 'tex':
            obj.innerHTML = "<i class='fa fa-file-code-o' aria-hidden='true' style='color: #0078D7'></i>";
            break;
        default:
            obj.innerHTML = "<i class='fa fa-file-text-o' aria-hidden='true'></i>";
            break;
    }
    return obj;
}
