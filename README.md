# Wildlife Collection

A place for people to share photos and videos of nature.

## Features

Possibility to browse photos and videos posted by users.

Browse by newest and most liked or use search tool to search by a keyword.

Location data of photo is visible unless user has deleted exifdata.

Create own account to be able to post content.

Like and comment on other peoples' content.

Being able to delete own photos, videos or comments.

Admin users have possibility to delete anything.

Responsive design.

## Getting started

#### Install dependencies
* npm i

#### Generate keys and certificate with openssl for HTTPS
* openssl genrsa -out ssl-key.pem 2048

* openssl req -new -key ssl-key.pem -out certrequest.csr

* openssl x509 -req -in certrequest.csr -signkey ssl-key.pem -out ssl-cert.pem


* Put the keys and certificate in the root folder

#### Database model for database
* Take a look at: [lauriari.sql](https://github.com/Lauri92/wildlife_collection/blob/master/lauriari.sql) file

#### Required database information and JWT secretOrPrivatekey

#### Provide  *.env* with your corresponding values

* DB_HOST=`<db>`

* DB_USER=`<db-username>`

* DB_PASS=`<db-pw>`

* DB_NAME=`<db-name>`

* JWT=`<jwt-secret>`

* HTTPS_PORT=8000

* HTTP_PORT=3000

*jwt-secret is used in authController.js and pass.js, value can be anything*



#### Create folders for media to be uploaded into 

* Uploads
* Thumbnails



#### Start app by typing
node app.js

#### Open http://localhost:3000 or https://localhost:8000
* http is redirected to https