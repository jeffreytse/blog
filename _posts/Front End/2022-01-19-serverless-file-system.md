---
layout: post
title: Serverless File System based on AWS S3
tags: ["Program Design", "Web", "Serverless"]
category: ["Frontend"]
---

This system is deployed on [My blog's file Sharing Page]({{site.baseurl}}/files.html) as a front-end application.

![Serverless-file-system](https://markdown-img-1304853431.file.myqcloud.com/20220119171645.jpg)

Reference Information:

* [Viewing Photo stored in S3 Buckets](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photos-view.html)
* [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html)
* [AWS Cognito Identity Pool](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html#getting-started-browser-create-identity-pool)

## How these Work?

A user identity pool is created using AWS Cognito. Any user authenticated / unauthenticated join this identity pool will be automatically assigned with an AWS role. Then, we create a AWS SDK key corresponding to this identity pool. Anyone access AWS Service using SDK and given key will get an role called `Cognito_MyBlogFilesUnAuth_Role`.

Using IAM, we can assign this role with permission to access some specific AWS Resource. In this case, we only allow users to access the S3 storage bucket `yutian-public` and allow them to `List` and `Get` objects from the bucket.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::yutian-public"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::yutian-public/*"
        }
    ]
}
```


