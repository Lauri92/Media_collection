# Media Collection

*A simplified version of "instagram like" media sharing application.*

## Features

* Possibility to browse photos and videos posted by users.

* Browse by newest and most liked.

* Search feature to search with a keyword, query the database by searching from media descriptions or hashtags.

* Location data of photo is visible on a map unless user has deleted exif metadata.

* Create own account to be able to post content.

* Like and comment on other peoples' content.

* Being able to delete own photos or videos.

* Responsive design.

## Design pattern

The application is built following the MVC software design pattern. HTTP requests from client side are handled in
controllers which are linked into models. Models are linked into database and they return data for the controller to
process and have no other functionality, lastly the controller will return processed data to client side in JSON form if
the request was in GET form otherwise the posted data is processed by controller and updated into database via model.
Routes which the application use are determined in the app.js file. Every route has its respective file to keep the
structure clearer.

## Security

* Passwords are hashed by using [bcrypt.js](https://www.npmjs.com/package/bcryptjs) package.
* Upon submitting login credentials via form, local authentication strategy authenticates request based on the submitted
  credentials.
* Authorization is tracked via JSON webtokens which are signed and issued to user at log in. Some GET requests and all
  POST, PUT and DELETE requests require a JSON webtoken. Whenever the user wants to access a protected route or
  resource, the user has to provide a JWT in the Authorization header using Bearer schema in order to be authenticated.
  Lack of JSON webtoken will result in 403 error.

**IMPORTANT NOTE:**

* All routes are protected and therefore require a JWT. This is done so that no one can access the API unless they are
  provided a user account by me. Also the end point for registering a new user is not active, so that I have the control
  over who has access to application completely. I ended up with this approach so that I can minimize possible abuse
  which could be done by some malicious individuals. This was not the original plan.

## Database model for database

The implemented relational database is MariaDB. All information is stored in 5 different tables:

* Users
    * Id
    * Name
    * Lastname
    * Email (username which is used to login)
    * Admin (simply just 0 or 1),
    * Profile picture

* Medias
    * Id,
    * User_id (owner of the media)
    * Description (small description about the uploaded media)
    * Filename, Coords (*if media had exif data available*)
    * Date (time when the media was posted), Postdate (original time when the media was taken, *if this exifdata was
      available*)
    * Mediatype (either image or video, other types are not allowed to pass validation)

* Comments
    * Id,
    * Media_id (id of media this comment references to),
    * User_id (who posted this comment),
    * comment (the actual comment what user typed),
    * Date

* Likes
    * Id,
    * Media_id (id of media this like references to),
    * Likes (user liked),
    * Dislikes (user disliked, this actually has no use),
    * User_id (who liked)

* Hashtags
    * Id,
    * Tag (name user gave for tag attached to an image),
    * Media_id (id of media this tag references to)

<img src="./DB%20constraints.png" width="800" height="500" alt="db-constraints">

All SQL commands are executed in models and each table has its own model. Some of the SQL commands are not in use but
they are written there in case they would be needed for some additional feature in the future.

Npm package used for handling SQL connection is [Node MySQL 2](https://www.npmjs.com/package/mysql2).

Queries are executed using prepared statements which is a way to deal with SQL injection attacks and provide better
performance than standard queries. The application uses a connection pool which allows a connection to be open to MySQL
server all the time instead of closing the connection after every query, this also increases performance (see
Database/db).

When storing medias, only the reference to the file (filename) is saved into the database. The medias are uploaded into
AWS S3 bucket for fetching.

## Uploading medias

All images and videos are initially uploaded into the server and not straight into AWS S3, also the images have max
filesize of 20Mb. Before uploading to S3, images have their coordinates and original photo taken time extracted from
exif metadata and go through resizing and only after that they are uploaded to S3. No data is exctracted from exif
metadata when posting a profile picture. Package used to handle uploading image to server is done
by [Multer](https://www.npmjs.com/package/multer), image resizing is done by
using [Sharp](https://www.npmjs.com/package/sharp) and extracting Exif metadata
by [Exif](https://www.npmjs.com/package/exif).

**NOTE: Upon fetching an image from S3 the data is converted into base64 string, and sent to the client side. (This is not the
fastest or most efficient way but this way the S3 bucket information stays as private as possible). This also means that
the images and videos might load slowly. See Utils/encode.**

## Validation

The application also has some backend validation. When creating an account, posting media, posting a comment or updating
profile picture several inputs are validated by using [Express-validator](https://express-validator.github.io/docs/).
These validations include:

* Checking the type of file the user is uploading (only images and videos allowed).
* Username or comment isn't too short and isn't a "bad word".
* Password matching requirement (8 letters and atleast 1 capital letter).
* Email has to be a proper email (must contain @ mark).

## Front end

All of front end is done by using vanilla JS, no frontend libraries or frameworks are implemented. CSS is also
completely built up from the scratch, and the app doesn't use any external CSS frameworks like bootstrap, responsiveness
is implemented by media queries. Also the app doesn't use any templating engine but rather just sends the data to client
in json form where it is parsed and used to modify the DOM dynamically.

Basic idea how the site behaves is that "small cards" are created in the "card container" depending what user has
requested, show most recent, show by most likes or show by search results. These cards contain some information about
the image which is shown in the card on a mouseover. These small cards are clickable, and when clicked they open a  "
large card" which contains more information including description, like button, show map button and comments.

## Known issues *both user and developer in mind..*

* The application has a responsive design but some phone models might have issues.
* Typing a comment with a phone is not very optimized.
* Testing done with just chrome and firefox so other browsers might have issues.
* Frontpage has a button to search for other users but this button has no actual functionality.
* Webpage has infinite scroll but the loading indicator still displays even if there is no more media to be fetched
  from. DB.
* Side chevrons on big card have no functionality
* More trying and catching should be implemented for those functions containing fetch. *Doesn't mean that there are many
  errors to be expected but more of try and catch wouldn't hurt*.
* There is no admin page or any real admin interaction implemented.
* All data is stored in same S3 bucket.
* Hashtags aren't validated.
* No length limits for user inputs.
* Code repetition in some places which could be avoided by refactoring

## Getting started

**IMPORTANT NOTE:**

* All routes are protected and therefore require a JWT. This is done so that no one can access the API unless they are
  provided a user account by me. Also the end point for registering a new user is not active, so that I have the control
  over who has access to application completely. I ended up with this approach so that I can minimize possible abuse
  which could be done by some malicious individuals. This was not the original plan.

Upon landing on the website user will have access to view media already posted by other users and user will also have
access to use the search tool for searching. Non registered users won't have access to any other interactions besides
this. Top navbar has options for logging in or registering an account. After filling the registration form successfully
and passing the front end validation user will get notification that the account creation was successful or if the back
end side validation fails user will receive an error describing the issue.

After registration user can log in by using the credentials which the user just provided in the registration form. After
logging in user gains more possibilities to interact with the webpage. First of all user gains the possibility to like
other users posted media. Secondly user can also comment medias. Thirdly user can now add media on the webpage by
clicking the "Add media"-button on the navbar.

A profile page is also available now, the profile page can be accessed by clicking the profile avatar on the right end
of the navbar every freshly created account will have same portrait placeholder image as profile picture. Profile page
allows the deletion of medias which the user owns, also the profile picture can be changed by clicking the picture.







