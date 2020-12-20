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

//Modals
const loginModal = document.querySelector('#login-modal');
const registerModal = document.querySelector('#register-modal');
const addMediaModal = document.querySelector('#add-media-modal');
const bigCardModal = document.querySelector('.modal');

// Forms
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const addMediaForm = document.querySelector('#add-media-form');

// Misc
const imgInput = document.querySelector('#img-input');

/**
 * Function to create media cards on the page
 */
const createMediaCards = async (content) => {
  console.log(content);
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

/**
 * Event listeners on buttons
 */
// Open the login modal
loginButton.addEventListener('click', async (e) => {
  loginModal.style.display = 'flex';
});

// Open the register modal
registerButton.addEventListener('click', async (e) => {
  registerModal.style.display = 'flex';
});

// Open modal for adding media
addMediaButton.addEventListener('click', async (e) => {
  //TODO: Open Modal
  console.log('clicked');
  addMediaModal.style.display = 'flex';
});

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

  } catch (e) {
    console.log(e.message);
  }
});

// TODO: NOT WORKING
// Close big card when in mobile mode (different close button)
bigCardMobileCloseButton.addEventListener('submit', async (e) => {
  console.log('clicked mobile close button');
  bigCardModal.style.display = 'none';
});

// All elements with class fa-times will get this eventlistener. (login, register, addMedia)
Array.from(closeButtons).forEach(function(button) {
  button.addEventListener('click', closeModals);
});

/**
 * Event listeners on forms
 */
// Login request
// TODO: Add check for token before logging in
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const data = await serializeJson(loginForm);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url + '/auth/login', fetchOptions);
    const json = await response.json();
    console.log('login response', json);

    if (!json.user) {
      //TODO: Implement better looking response
      alert(json.message);
    } else {
      //Set token
      sessionStorage.setItem('token', json.token);
      console.log('token: ', sessionStorage.getItem('token'));
      await getLoggedUser();
      await setUserAslogged();
      await getAllMedia();
    }
  } catch (e) {
    console.log(e.message);
  }
});

// Register request
// TODO: Add check for token before registering
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const validationPass = checkInputs();
    console.log(validationPass);

    if (validationPass) {
      const data = await serializeJson(registerForm);
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      console.log(data);

      //TODO: Allow registering to login without failures
      const response = await fetch(url + '/auth/register', fetchOptions);
      const json = await response.json();
      console.log('login response', json);
      registerModal.style.display = 'none';
      //TODO: Account created pop up?
    } else {
      console.log('Validation failure');
    }
  } catch (e) {
    console.log(e.message);
  }
});

// Add-media request
// TODO: Add thumbnail for videos too
addMediaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(addMediaForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/media', fetchOptions);
  const json = await response.json();
  console.log('add media response', json);
  console.log('json.pick_id', json.id);
});

/**
 * Functions containing a request to server
 */
// Get all media stored by all users. Token is required to request for this information.
const getAllMedia = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/media/media', options);
    const media = await response.json();
    await createMediaCards(media);
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

    // Set profile picture in nav bar
    const profileImg = document.createElement('img');
    profileImg.src = `./Thumbnails/${userInfo.profile_picture}`;
    profileButton.appendChild(profileImg);

  } catch (e) {
    console.log(e.message);
  }
};

/**
 * Functions for utility
 */
// Adjust nav-bar elements if user has a json web-token
function setUserAslogged() {
  loginModal.style.display = 'none';
  loginButton.style.display = 'none';
  registerButton.style.display = 'none';
  logoutButton.style.display = 'flex';
  profileButton.style.display = 'flex';
  addMediaButton.style.display = 'flex';
}

// Set thumbnail of to-be-uploaded photo
imgInput.onchange = function() {
  const reader = new FileReader();
  // TODO: Check for video file too
  reader.onload = function(e) {
    // Get loaded data and render thumbnail.
    document.getElementById('to-be-uploaded').src = e.target.result;
  };

  // Read the image file as a data URL.
  reader.readAsDataURL(this.files[0]);
};

// Function to be called when closing modals
function closeModals() {
  loginModal.style.display = 'none';
  registerModal.style.display = 'none';
  addMediaModal.style.display = 'none';
}

// For register modal checking user input
function checkInputs() {
  let errors = 0;

  const firstname = document.querySelector('#firstname');
  const lastname = document.querySelector('#lastname');
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');
  const password2 = document.querySelector('#password2');

  // trim to remove the whitespaces
  const firstnameValue = firstname.value.trim();
  const lastnameValue = lastname.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  if (firstnameValue === '') {
    setErrorFor(firstname, 'First name cannot be blank');
    errors++;
  } else {
    setSuccessFor(firstname);
  }

  if (lastnameValue === '') {
    setErrorFor(lastname, 'Last name cannot be blank');
    errors++;
  } else {
    setSuccessFor(lastname);
  }

  if (emailValue === '') {
    setErrorFor(email, 'Email cannot be blank');
    errors++;
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, 'Not a valid email');
    errors++;
  } else {
    setSuccessFor(email);
  }

  if (passwordValue === '') {
    setErrorFor(password, 'Password cannot be blank');
    errors++;
  } else {
    setSuccessFor(password);
  }

  if (password2Value === '') {
    setErrorFor(password2, 'Password2 cannot be blank');
    errors++;
  } else if (passwordValue !== password2Value) {
    setErrorFor(password2, 'Passwords does not match');
    errors++;
  } else {
    setSuccessFor(password2);
  }
  // Return true if 0 errors, else return false
  return errors <= 0;
}

// Ser error for user to see
function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector('small');
  formControl.className = 'form-control error';
  small.innerText = message;
}

// Set indication for succesful input
function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email);
}

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
    mediaOwnerProfilePic.src = 'https://placekitten.com/50/50';
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
      commentOwnerProfilePic.src = 'https://placekitten.com/250/250';
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
          commentOwnerProfilePic.src = 'https://placekitten.com/250/250';
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

// Check for the token...if it exists do these
const isToken = (sessionStorage.getItem('token'));
if (isToken) {
  getLoggedUser();
  setUserAslogged();
  getAllMedia();
} else {
  console.log('No token, log in plz');
}