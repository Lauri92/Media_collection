'use strict';
const url = 'https://localhost:8000';
const body = document.body;

// Buttons
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');
const profileButton = document.querySelector('#profile-button');
const addMediaButton = document.querySelector('#add-media-button');
const closeButtons = document.getElementsByClassName('fa-times');
const bigCardCloseButton = document.querySelector('.close-button');
const bigCardMobileCloseButton = document.querySelector('.mobile-close-button');
const imageAmountButton = document.querySelector('.image-amount');
const videoAmountButton = document.querySelector('.video-amount');

//Modals
const addMediaModal = document.querySelector('#add-media-modal');
const bigCardModal = document.querySelector('.modal');

// Forms
const addMediaForm = document.querySelector('#add-media-form');

// Get images of logged in user
const getUserImages = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/media/specifiedusermedia/image',
        options);
    const media = await response.json();
    console.log(media);
    await createMediaCards(media);
  } catch (e) {
    console.log(e.message);
  }
};

// Get count of user images
const getUserImagesCount = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/media/specifiedusermediacount/image',
        options);
    const imageCount = await response.json();
    console.log('imageCount: ', imageCount.count);
    const photoAmount = document.querySelector('.image-amount');
    photoAmount.innerHTML = `${imageCount.count} Images`;


  } catch (e) {
    console.log(e.message);
  }
};

// Get videos of logged in user
const getUserVideos = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/media/specifiedusermedia/video',
        options);
    const media = await response.json();
    console.log(media);
    await createMediaCards(media);
  } catch (e) {
    console.log(e.message);
  }
};

// Get count of user videos
const getUserVideosCount = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/media/specifiedusermediacount/video',
        options);
    const videoCount = await response.json();
    console.log('videCount :', videoCount.count);
    const videoAmount = document.querySelector('.video-amount');
    videoAmount.innerHTML = `${videoCount.count} Videos`;
  } catch (e) {
    console.log(e.message);
  }
};

// Get likes of a certain media by it's id
const getLikes = async (media_id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/likes/' + media_id,
        options);
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
};

// Get comments belonging to a certain media by it's id
const getComments = async (media_id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/comments/' + media_id,
        options);
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
};

// Checks if the user has liked the photo already
const getLikeStatus = async (media_id) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url + '/likes/likestatus/' + media_id,
        options);
    return await response.json();
  } catch (e) {
    console.error(e.message);
  }
};

// Adjust nav-bar elements if user has a json web-token
function setUserAslogged() {
  loginButton.style.display = 'none';
  registerButton.style.display = 'none';
  logoutButton.style.display = 'flex';
  profileButton.style.display = 'flex';
  addMediaButton.style.display = 'flex';
}

const getLoggedUser = async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url + '/user/check/userlogged',
        options);
    const userInfo = await response.json();
    console.log(userInfo);

    // Set profile picture in nav bar and in profile picture holder
    const profileImg = document.createElement('img');
    const bigProfileImg = document.querySelector('.user-profile-pic');
    bigProfileImg.src = `./Thumbnails/${userInfo.profile_picture}`;
    profileImg.src = `./Thumbnails/${userInfo.profile_picture}`;
    profileButton.appendChild(profileImg);

    // Set username in user page
    const username = document.querySelector('.user-name');
    username.innerHTML = `${userInfo.name} ${userInfo.lastname}`;

    // Set email in user page
    const userEmail = document.querySelector('.user-email');
    userEmail.innerHTML = `${userInfo.email}`


  } catch (e) {
    console.log(e.message);
  }
};

// Logout logged user
logoutButton.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/auth/logout', options);
    const json = await response.json();
    console.log(json);

    // remove token
    sessionStorage.removeItem('token');

    // TODO: Add prettier log out
    alert('You have logged out');

    // Show login and registration buttons again
    registerButton.style.display = 'block';
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
    addMediaButton.style.display = 'none';
    profileButton.style.display = 'none';
    window.location.href = 'index.html';

  } catch (e) {
    console.log(e.message);
  }
});

// Get users images
imageAmountButton.addEventListener('click', async () => {
  await getUserImages();
})

// Get users videos
videoAmountButton.addEventListener('click', async () => {
  await getUserVideos();
})

// Check for the token...if it exists do these
const isToken = (sessionStorage.getItem('token'));

const createUi = async () => {
  try {
    if (isToken) {
      setUserAslogged();
      await getUserImagesCount();
      await getUserVideosCount();
      await getLoggedUser();
    } else {
      body.innerHTML = '';
      console.log('No token, log in plz');
    }
  } catch (e) {
    console.log(e.message);
  }
};

createUi();


/**
 * Functions to create media cards on the page
 */
const createMediaCards = async (content) => {
  console.log(content);
  //Always clear card area before adding new cards
  document.querySelector('.cards').innerHTML = '';
  try {
    for await (const media of content) {

      try {
        // Create small cards
        await createSmallCards(media);
      } catch (e) {
        console.log(e.message);
      }

    }

  } catch (e) {
    console.log(e.message);
  }
};

const createSmallCards = async (media) => {
  //console.log(mediaLikes[0].likes);

  const cards = document.querySelector('.cards');     //Container for all the cards
  const smallCardDiv = document.createElement('div');
  smallCardDiv.className = 'card';
  const smallCardImg = document.createElement('img');
  const smallCardVid = document.createElement('video');
  const smallCardInfo = document.createElement('div');
  smallCardInfo.className = 'info';
  const smallCardH1 = document.createElement('h1');
  const smallCardP = document.createElement('p');
  // Place information to cards
  //Check if the media is image or video and only create either one
  if (media.mediatype === 'image') {
    smallCardImg.src = url + '/Thumbnails/' + media.filename;
    smallCardDiv.appendChild(smallCardImg);
  } else {
    smallCardVid.src = url + '/Uploads/' + media.filename;
    smallCardDiv.appendChild(smallCardVid);
  }

  // Add media owners name and last name to card
  smallCardH1.innerHTML = `${media.name} ${media.lastname}`;

  // Also add likes and comments to card
  try {
    // Get all likes of the image
    const mediaLikes = await getLikes(media.id);
    // Some media have no likes yet
    if (undefined === mediaLikes[0]) {
      // No likes
      smallCardP.innerHTML = `Likes: 0`;
    } else {
      // Has likes
      smallCardP.innerHTML = `Likes: ${mediaLikes[0].likes}`;
    }
    const comments = await getComments(media.id);
    if (comments.length < 1) {
      // No likes
      smallCardP.innerHTML += `<br>Comments: 0`;
    } else {
      // Has likes
      smallCardP.innerHTML += `<br>Comments: ${comments.length}`;
    }

  } catch (e) {
    console.log(e.message);
  }

  smallCardInfo.appendChild(smallCardH1);
  smallCardInfo.appendChild(smallCardP);

  smallCardDiv.appendChild(smallCardInfo);
  cards.appendChild(smallCardDiv);

  // Add event listener to create a big card
  smallCardDiv.addEventListener('click', async () => {
    console.log(`Clicked media with id of ${media.id}`);
    try {
      await createBigCard(media);
      // Avoid scrolling background while big card is open
      body.style.overflow = 'hidden';
    } catch (e) {
      console.log(e.message);
    }
  });
};

// Contains more detailed info about media, description, likes, comments..
const createBigCard = async (media) => {
  console.log(media);
  document.querySelector('.modal').style.display = 'flex';
  try {

    // Left side of the big card or top part in mobile view
    const bigCardMediaDiv = document.querySelector('.big-card-media');
    const bigCardImage = document.createElement('img');
    const bigCardVideo = document.createElement('video');

    if (media.mediatype === 'image') {
      bigCardImage.src = url + '/Thumbnails/' + media.filename;
      bigCardMediaDiv.appendChild(bigCardImage);
    } else {
      bigCardVideo.src = url + '/Uploads/' + media.filename;
      bigCardVideo.controls = true;
      bigCardMediaDiv.appendChild(bigCardVideo);
    }

    // Right side or bottom part in mobile view
    // Media owner info and post date
    const userInfoDiv = document.querySelector('.user-info');
    const mediaOwner = document.createElement('p');
    const mediaOwnerProfilePic = document.createElement('img');
    const postdate = media.post_date.replace('T', ' ').
        replace('Z', '').
        slice(0, -7);

    mediaOwner.innerHTML = `${media.name} ${media.lastname} @ ${postdate}`;
    mediaOwnerProfilePic.src = `./Thumbnails/${media.profile_picture}`;
    userInfoDiv.appendChild(mediaOwner);
    userInfoDiv.appendChild(mediaOwnerProfilePic);

    // Description of media
    const description = document.querySelector('.description');
    description.innerHTML = `${media.description}`;

    // Comment section
    const comments = await getComments(media.id);
    console.log(comments);

    // All comments of certain media
    const allComments = document.querySelector('.comments');

    // Target span to hold the comments
    const bigCardComments = document.querySelector('#big-card-comments');

    try {
      if (comments.length > 0) {
        bigCardComments.innerHTML = comments.length;
        //inputComments.insertBefore(bigCardComments, inputComments.firstChild);
      } else {
        bigCardComments.innerHTML = '0';
        //inputComments.insertBefore(bigCardComments, inputComments.firstChild);
      }
    } catch (e) {
      console.log(e.message);
    }

    // Iterate over all comments associated with this piece of media
    for await (const comment of comments) {
      const commentContainerDiv = document.createElement('div');
      commentContainerDiv.className = 'comment-container';
      const commentUserInputDiv = document.createElement('div');
      commentUserInputDiv.className = 'comment-user-input';

      // Create img element for comment owner profile pic
      const commentOwnerProfilePic = document.createElement('img');
      commentOwnerProfilePic.className = 'comment-profile-pic';
      commentOwnerProfilePic.src = `./Thumbnails/${comment.profile_picture}`;
      commentContainerDiv.appendChild(commentOwnerProfilePic);

      // Create p element for user input date
      const userInputDate = document.createElement('p');
      userInputDate.className = 'user-input-date';
      const postdate = comment.date.replace('T', ' ').
          replace('Z', '').
          slice(0, -7);
      userInputDate.innerHTML = `${comment.name} ${comment.lastname} @ ${postdate}`;
      commentUserInputDiv.appendChild(userInputDate);

      // Create p element for user input message
      const userInputMessage = document.createElement('p');
      userInputMessage.className = 'user-input-message';
      userInputMessage.innerHTML = `${comment.comment}`;
      commentUserInputDiv.appendChild(userInputMessage);

      // Append date and comment into single comment container
      commentContainerDiv.appendChild(commentUserInputDiv);

      // Append single comment content to all comments
      allComments.appendChild(commentContainerDiv);

    }

    // Target the span to hold the likes
    const bigCardLikes = document.querySelector('#big-card-likes');

    try {
      // Get all likes of the media
      const mediaLikes = await getLikes(media.id);
      // Some media have no likes yet
      if (undefined === mediaLikes[0]) {
        // No likes
        bigCardLikes.innerHTML = '0';
        //inputLikes.insertBefore(bigCardLikes, inputLikes.firstChild);
      } else {
        // Has likes
        bigCardLikes.innerHTML = `${mediaLikes[0].likes}`;
        //inputLikes.insertBefore(bigCardLikes, inputLikes.firstChild);
      }

    } catch (e) {
      console.log(e.message);
    }

    // Check if the currently logged in user has already liked this piece of media
    const hasLiked = await getLikeStatus(media.id);
    const heart = document.querySelector('.fa-heart');

    if (hasLiked.result === true) {
      //User has already liked this media
      console.log('You have liked already.');
      heart.style.color = '#B00923';
    } else {
      heart.addEventListener('click', likeMedia);
      heart.style.cursor = 'pointer';
    }

    async function likeMedia() {
      try {
        const options = {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' +
                sessionStorage.getItem('token'),
          },
        };
        console.log(options);
        // Fetch to give this media a like
        const response = await fetch(
            url + '/likes/incrementlike/' + media.id, options);
        const json = await response.json();
        console.log('add like response', json);
        heart.style.color = '#B00923';

        // Update the UI, so fetch the new like amount from database
        const mediaLikes = await getLikes(media.id);
        // Must be at least one like now so there is no need to check if the value is undefined
        bigCardLikes.innerHTML = `${mediaLikes[0].likes}`;

        // Remove evenlistener from heart
        heart.removeEventListener('click', likeMedia);
        // Cursor back to normal too
        heart.style.cursor = 'auto';

      } catch (e) {
        console.log(e.message);
      }
    }

    // Select commentForm to add eventlistener to post a comment
    const commentForm = document.querySelector('.post-comment-form');

    commentForm.addEventListener('submit', postComment);

    async function postComment(e) {
      e.preventDefault();
      try {
        const data = serializeJson(commentForm);
        const fetchOptions = {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        console.log(fetchOptions);
        const response = await fetch(
            url + `/comments/${media.id}`, fetchOptions);
        const json = await response.json();
        console.log('add comment response', json);

        // Clear the comment textarea
        document.querySelector('.post-comment-textarea').value = '';

        // Update the comment section to show users comment in real time withhout closing and opening card again
        allComments.innerHTML = '';

        // Get updated comments
        const comments = await getComments(media.id);

        // Update the big card amount of likes, no need to check for undefined, there will be atleast 1 comment
        // in this case
        bigCardComments.innerHTML = comments.length;

        // Iterate over all comments associated with this piece of media
        for await (const comment of comments) {
          const commentContainerDiv = document.createElement('div');
          commentContainerDiv.className = 'comment-container';
          const commentUserInputDiv = document.createElement('div');
          commentUserInputDiv.className = 'comment-user-input';

          // Create img element for comment owner profile pic
          const commentOwnerProfilePic = document.createElement('img');
          commentOwnerProfilePic.className = 'comment-profile-pic';
          commentOwnerProfilePic.src = `./Thumbnails/${comment.profile_picture}`;
          commentContainerDiv.appendChild(commentOwnerProfilePic);

          // Create p element for user input date
          const userInputDate = document.createElement('p');
          userInputDate.className = 'user-input-date';
          const postdate = comment.date.replace('T', ' ').
              replace('Z', '').
              slice(0, -7);
          userInputDate.innerHTML = `${comment.name} ${comment.lastname} @ ${postdate}`;
          commentUserInputDiv.appendChild(userInputDate);

          // Create p element for user input message
          const userInputMessage = document.createElement('p');
          userInputMessage.className = 'user-input-message';
          userInputMessage.innerHTML = `${comment.comment}`;
          commentUserInputDiv.appendChild(userInputMessage);

          // Append date and comment into single comment container
          commentContainerDiv.appendChild(commentUserInputDiv);

          // Append single comment content to all comments
          allComments.appendChild(commentContainerDiv);

        }

      } catch (e) {
        console.log(e.message);
      }
    }

    // Close big card and clear it by using innerHTML
    bigCardCloseButton.addEventListener('click', async (e) => {
      bigCardModal.style.display = 'none';
      // TODO: Remove created elements when closing the big card

      bigCardMediaDiv.innerHTML = '';
      userInfoDiv.innerHTML = '';
      description.innerHTML = '';
      bigCardComments.innerHTML = '';
      bigCardLikes.innerHTML = '';
      allComments.innerHTML = '';

      heart.style.color = '#8f8b8b';

      // Remove event listener from the form to not stack event listeners on top of same form
      commentForm.removeEventListener('submit', postComment);

      // Allow scrolling again
      body.style.overflow = 'visible';
    });

  } catch (e) {
    console.log(e.message);
  }
};