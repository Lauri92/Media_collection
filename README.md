# Media Collection

## Overview

A place for people to share photos and videos.

The application is built following the MVC software design pattern. HTTP requests from client side are handled in
controllers which are linked into models. Models are linked into database and they return data for the controller to
process and lastly the controller will return processed data to client side in JSON form, unless the HTTP request was
sent to modify the database content in which case the response is in simpler form which tells if the request succeeded
or not. Models only interact with the database and have no other functionality, they return database query results to
controller.

## Features

* Possibility to browse photos and videos posted by users.

* Browse by newest and most liked or use search tool to search by a keyword.

* Search feature to search with keyword, query the database by searching from media descriptions or hashtags

* Location data of photo is visible unless user has deleted exifdata.

* Create own account to be able to post content.

* Like and comment on other peoples' content.

* Being able to delete own photos or videos.

* Responsive design.

## Security

* Passwords are hashed by using [bcrypt.js](https://www.npmjs.com/package/bcryptjs) package
* Authorization is tracked via JSON webtokens which are signed by using private secret key. Some GET requests and all
  POST, PUT and DELETE requests require a json webtoken. Whenever the user wants to access a protected route or
  resource, the user should provide a JWT in the Authorization header using Bearer schema.

## Database model for database

The implemented relational database is MariaDB. All information is stored in 5 different tables:

* Users
    * Id, Name , Lastname , Email (username which is used to login), Admin (simply just 0 or 1), Profile picture

* Medias
    * Id, User_id (owner of the media), Description (small description about the uploaded media), Filename, Coords (*if
      media had exif data available*), Date (time when the media was posted), Postdate (original time when the media was
      taken, *if this exifdata was available*), Mediatype (either image or video, other types are not allowed to pass
      validation)

* Comments
    * Id, Media_id (id of media this comment references to), User_id (who posted this comment), comment (the actual
      comment what user typed), Date

* Likes
    * Id, Media_id (id of media this like references to), Likes (user liked), Dislikes (user disliked, this actually has
      no use), User_id (who liked)

* Hastags
    * Id, Tag (name user gave for tag attached to an image), Media_id (id of media this tag references to)

<img src="./DB%20constraints.png" width="800" height="500" alt="db-constraints">

All SQL commands are executed in models and each table has its own model. Some of the SQL commands are not in use but
they are written there in case they would be needed for some additional feature in the future.

Npm package used for handling SQL connection is [Node MySQL 2](https://www.npmjs.com/package/mysql2).

Queries are executed using prepared statements which is a way to deal with SQL injection attacks and provide better
performance than standard queries. The application uses a connection pool which allows a connection to be open to MySQL
server all the time instead of closing the connection after every query, this also increases performance (Database/db).

When storing medias, only the key to media is saved into the database. The medias are uploaded into AWS S3 bucket for
fetching.

## Front end

All of front end is done by using vanilla JS, no frontend libraries or frameworks are implemented, not even jQuery is
used. CSS is also completely built up from the scratch and the app doesn't use any external CSS frameworks like
bootstrap. Also the app doesn't use any templating engine but rather just sends the data to client in json form where it is parsed
and used to modify the DOM dynamically.

## Known issues

* The application has a responsive design but some phone models might have issues
* Typing a comment with a phone is not very optimized
* Testing done with just chrome and firefox so other browsers might have issues
* Frontpage has a button to search for other users but this button has no actual functionality
* Webpage has infinite scroll but the loading indicator still displays even if there is no more media to be fetched from
  DB
* More trying and catching should be implemented for those functions containing fetch. *Doesn't mean that there are many
  errors to be expected but more of try and catch wouldn't hurt*

## Getting started

Upon landing on the website user will have access to view media already posted by other users. Non registered users
won't have access to any other interactions besides this. Top navbar has options for logging in or registering an
account. After filling the registration form succesfully and passing the front end validation user will get notification
that the account creation was succesful or if the back end side validation fails user will receive an error describing
the issue.

After registration user can log in by using the credentials which the user just provided in the registration form. After
logging in user gains more possibilities to interact with the webpage. First of all user gains the possibility to like
other users posted media. Secondly user can also comment medias. Thirdly user can now add media on the webpage by
clicking the "Add media"-button on the navbar.

A profile page is also available now, the profile page can be accessed by clicking the profile avatar on the right end
of the navbar. Profile page allows the deletion of medias which the user owns, also the profile picture can be changed
by clicking the picture.







