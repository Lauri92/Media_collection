'use strict';
//const url = 'https://localhost:8000';
const url = 'https://safe-hamlet-45360.herokuapp.com';
const body = document.body;

// Map items
mapboxgl.accessToken = 'pk.eyJ1IjoicGV4aSIsImEiOiJja2hhN241bzYweXBtMnBuenA5Y3NxOGlmIn0.b1NkQwYNPY04r4MBe99rBQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11', // stylesheet location
  zoom: 9, // starting zoom
});
let marker;

// Buttons
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');
const profileButton = document.querySelector('#profile-button');
const addMediaButton = document.querySelector('#add-media-button');
const closeButtons = document.getElementsByClassName('fa-times');
const bigCardCloseButton = document.querySelector('.close-button');
const bigCardMobileCloseButton = document.querySelector('.mobile-close-button');
const searchMostRecent = document.querySelector('#search-most-recent');
const searchMostLiked = document.querySelector('#search-most-liked');

//Modals
const loginModal = document.querySelector('#login-modal');
const registerModal = document.querySelector('#register-modal');
const addMediaModal = document.querySelector('#add-media-modal');
const bigCardModal = document.querySelector('.modal');

// Forms
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const addMediaForm = document.querySelector('#add-media-form');
const searchForm = document.querySelector('#search-form');

// Search bar control buttons
const searchMedias = document.querySelector('.photo-video-button');
const searchUsers = document.querySelector('.users-button');
const searchTags = document.querySelector('.hashtags-button');
// Set default values to search bar
let searchFor = 'descriptions';
searchMedias.style.border = '5px solid #2c860c';

// Misc
// Control the thumbnail image for uploads
const imgInput = document.querySelector('.img-input');

// Keep track of AJAX call if true -> AJAX call still happening, don't allow new one
let isLoading = false;

// Balls which are displayed when the window is scrolled to the bottom
const loading = document.querySelector('.loading');
const categoryLoadAnimation = document.querySelector('.category-load');

// Add default values
searchMostRecent.classList.add('active-search-option');
let toGet = 'recent';
let limit1 = 0;
let limit2 = 6;
let totalMediaCount = 0;

// Infinite scrolling
window.addEventListener('scroll', () => {
  const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

  //console.log( { scrollTop, scrollHeight, clientHeight });

  if (clientHeight + scrollTop >= scrollHeight - 5) {
    // show the loading animation and fetch more photos
    showLoading();
  } else {
    loading.classList.remove('show');
  }
});

function showLoading() {

  loading.classList.add('show');
  if (toGet === 'recent' && limit1 < totalMediaCount) {
    setTimeout(getSomeMedia);
  } else if (toGet === 'likes' && limit1 < totalMediaCount) {
    setTimeout(getSomeLikedMedia);
  } else {
    // Do nothing
  }
}

function categoryLoad(toggle) {
  if (toggle === true) {
    categoryLoadAnimation.classList.add('show');
  } else {
    categoryLoadAnimation.classList.remove('show');
  }
}

/**
 * Function to create media cards on the page
 */
const createMediaCards = async (content) => {
  console.log(content);
  //document.querySelector('.cards').innerHTML = '';
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
  body.style.overflow = 'hidden';
});

// Open the register modal
registerButton.addEventListener('click', async (e) => {
  registerModal.style.display = 'flex';
  body.style.overflow = 'hidden';
});

// Open modal for adding media
addMediaButton.addEventListener('click', async (e) => {
  console.log('clicked');
  addMediaModal.style.display = 'flex';
  body.style.overflow = 'hidden';
});

// Logout logged user
logoutButton.addEventListener('click', async (e) => {
  e.preventDefault();
  await doLogout();
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
    // console.log('login response', json);

    if (!json.user) {
      // Wrong credentials
      //TODO: Implement better looking response
      alert(json.message);
    } else {
      //Set token
      sessionStorage.setItem('token', json.token);
      // console.log('token: ', sessionStorage.getItem('token'));
      alert(`Welcome ${json.user.name}`);
      location.reload();
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
      try {
        const data = await serializeJson(registerForm);
        const fetchOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };

        const response = await fetch(url + '/auth/register', fetchOptions);
        const json = await response.json();
        console.log('login response', json);
        alert(json.message || json[0].param + ' ' + json[0].msg);
        registerModal.style.display = 'none';
      } catch (e) {
        alert('Registration failure');
      }
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
  try {
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
    console.log('json.media_id', json.id);
    addMediaForm.reset();
    document.querySelector('#fileinput-form-control').value = '';
    document.querySelector('.to-be-uploaded-media').src = '';
    addMediaModal.style.display = 'none';
    body.style.overflow = 'visible';
    alert('Media added');
  } catch (e) {
    console.error(e);
    alert('Failed to post');
  }
});

// Search for most recent media
searchMostRecent.addEventListener('click', async (e) => {
  if (isLoading === false) {
    document.querySelector('.cards').innerHTML = '';
    toGet = 'recent';
    limit1 = 0;
    searchMostLiked.classList.remove('active-search-option');
    searchMostRecent.classList.add('active-search-option');
    await getSomeMedia();
    isLoading = false;
  }
});

// Search for most liked media
searchMostLiked.addEventListener('click', async (e) => {
  if (isLoading === false) {
    document.querySelector('.cards').innerHTML = '';
    toGet = 'likes';
    limit1 = 0;
    searchMostRecent.classList.remove('active-search-option');
    searchMostLiked.classList.add('active-search-option');
    await getSomeLikedMedia();
    isLoading = false;
  }
});

// Search for media by input
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const fetchOptions = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    };
    if (isLoading === false &&
        document.querySelector('#search-form input').value !== '') {
      isLoading = true;
      const response = await fetch(url + '/media/search/' + searchFor + '/' +
          document.querySelector('#search-form input').value,
          fetchOptions);
      const json = await response.json();
      console.log('/media/search/' + searchFor + '/', json);
      toGet = '';
      document.querySelector('.cards').innerHTML = '';
      searchMostLiked.classList.remove('active-search-option');
      searchMostRecent.classList.remove('active-search-option');
      await createMediaCards(json);
      isLoading = false;
    }
  } catch (e) {
    console.log(e.message);
  }
});

// Change search content to descriptions of images
searchMedias.addEventListener('click', async (e) => {
  e.preventDefault();
  searchMedias.style.border = '5px solid #2c860c';
  searchTags.style.border = '5px solid #f1f1f1';
  searchUsers.style.border = '5px solid #f1f1f1';
  document.querySelector(
      '#search-form input').placeholder = 'Search by descriptions...';
  searchFor = 'descriptions';
});

// Change search content to tags of images
searchTags.addEventListener('click', async (e) => {
  e.preventDefault();
  searchMedias.style.border = '5px solid #f1f1f1';
  searchTags.style.border = '5px solid #2c860c';
  searchUsers.style.border = '5px solid #f1f1f1';
  document.querySelector('#search-form input').placeholder = 'Search by tag...';
  searchFor = 'tags';
});

// Change search content to users
searchUsers.addEventListener('click', async (e) => {
  e.preventDefault();
  searchMedias.style.border = '5px solid #f1f1f1';
  searchTags.style.border = '5px solid #f1f1f1';
  searchUsers.style.border = '5px solid #2c860c';
  document.querySelector(
      '#search-form input').placeholder = 'Search for users...';
  searchFor = 'users';
});

/**
 * Functions containing a request to server
 */

// Get amount of media in database
const getTotalMediaCount = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + `/media/count`,
        options);
    const mediaCount = await response.json();
    console.log(mediaCount.total_media_count);
    totalMediaCount = mediaCount.total_media_count;
    console.log(totalMediaCount);
  } catch (e) {
    console.log(e.message);
  }
};
// Set value to variable
getTotalMediaCount();

// Get some recent media used for infinite scrolling
const getSomeMedia = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    if (isLoading === false) {
      categoryLoad(true);
      isLoading = true;
      const response = await fetch(url + `/media/scroll/${limit1}/${limit2}`,
          options);
      const media = await response.json();
      await createMediaCards(media);
      limit1 = limit1 + 6;
      isLoading = false;
      categoryLoad(false);
    }
  } catch (e) {
    console.log(e.message);
  }
};

// Get all media stored by all users by most recent
const getAllMedia = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    if (isLoading === false) {
      isLoading = true;
      const response = await fetch(url + '/media/media', options);
      const media = await response.json();
      await createMediaCards(media);
      isLoading = false;
    }
  } catch (e) {
    console.log(e.message);
  }
};

// Get some liked media used for infinite scrolling
const getSomeLikedMedia = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    if (isLoading === false) {
      categoryLoad(true);
      isLoading = true;
      const response = await fetch(
          url + `/media/scrolllikes/${limit1}/${limit2}`, options);
      const media = await response.json();
      await createMediaCards(media);
      limit1 = limit1 + 6;
      isLoading = false;
      categoryLoad(false);
    }
  } catch (e) {
    console.log(e.message);
  }
};

// Get all media by most liked
const getAllMediaLikes = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    if (isLoading === false) {
      isLoading = true;
      const response = await fetch(url + '/media/mostlikes', options);
      const media = await response.json();
      await createMediaCards(media);
      isLoading = false;
    }
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

const getHashtags = async (media_id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const hashtags = await fetch(url + '/hashtags/' + media_id,
        options);
    return await hashtags.json();
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

// Check who is logged in
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

    // Set profile picture in nav bar
    const profileImg = document.createElement('img');
    profileImg.src = 'data:image/jpeg;base64,' + userInfo.profile_picture;
    profileButton.appendChild(profileImg);

  } catch (e) {
    console.log(e.message);

  }
};

// Add marker to map
const addMarker = async (coords) => {
  map.setCenter(coords);
  map.setZoom(7);
  marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
};

// Handle logout
const doLogout = async () => {
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
    alert('You have logged out or token expired');

    location.reload();
    // Show login and registration buttons again
    registerButton.style.display = 'block';
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
    addMediaButton.style.display = 'none';
    profileButton.style.display = 'none';
    document.querySelector('#profile-button img').remove();
    document.querySelector('.cards').innerHTML = '';

    //window.location.href="profilePage.html"

  } catch (e) {
    console.log(e.message);
  }
}

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

// Set thumbnail of to-be-uploaded media
imgInput.onchange = function() {
  const reader = new FileReader();
  // TODO: Check for video file too
  reader.onload = function(e) {
    // Get loaded data and render thumbnail.
    document.querySelector('.to-be-uploaded-media').src = e.target.result;
  };

  // Read the image file as a data URL.
  reader.readAsDataURL(this.files[0]);
};

// Function to be called when closing modals
function closeModals() {
  loginModal.style.display = 'none';
  registerModal.style.display = 'none';
  addMediaModal.style.display = 'none';
  body.style.overflow = 'visible';
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

  if (firstnameValue === '' || firstnameValue.length < 3) {
    setErrorFor(firstname, 'First name value too short');
    errors++;
  } else {
    setSuccessFor(firstname);
  }

  if (lastnameValue === '' || lastnameValue.length < 3) {
    setErrorFor(lastname, 'Last name value too short');
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

  if (passwordValue === '' || !passwordValue.match('(?=.*[A-Z]).{8,}')) {
    setErrorFor(password, 'Must contain capital letter and 8 characters');
    errors++;
  } else {
    setSuccessFor(password);
  }

  if (password2Value === '' || !passwordValue.match('(?=.*[A-Z]).{8,}')) {
    setErrorFor(password2, 'Must contain capital letter and 8 characters');
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
    smallCardImg.src = 'data:image/jpeg;base64,' + media.filename;
    smallCardDiv.appendChild(smallCardImg);
  } else {
    smallCardVid.src = 'data:video/mp4;base64,' + media.filename;
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
      // No comments
      smallCardP.innerHTML += `<br>Comments: 0`;
    } else {
      // Has comments
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
  document.querySelector('.modal').style.display = 'flex';
  try {

    // Left side of the big card or top part in mobile view
    // Resize the map because it was opened in an initially hidden div and hide again
    const modalMap = document.querySelector('#map');
    map.resize();
    modalMap.style.display = 'none';

    const bigCardMediaDiv = document.querySelector('.big-card-media');
    const bigCardImage = document.createElement('img');
    const bigCardVideo = document.createElement('video');

    if (media.mediatype === 'image') {
      bigCardImage.src = 'data:image/jpeg;base64,' + media.filename;
      bigCardMediaDiv.appendChild(bigCardImage);
    } else {
      bigCardVideo.src = 'data:video/mp4;base64,' + media.filename;
      bigCardVideo.controls = true;
      bigCardMediaDiv.appendChild(bigCardVideo);
    }

    // Right side or bottom part in mobile view
    // Media owner info and post date and hashtags #
    const hashtags = await getHashtags(media.id);
    const userInfoDiv = document.querySelector('.user-info');
    const mediaOwner = document.createElement('p');
    const mediaOwnerProfilePic = document.createElement('img');
    const postdate = media.post_date.replace('T', ' ').
        replace('Z', '').
        slice(0, -7);

    mediaOwner.innerHTML = `${media.name} ${media.lastname} @ ${postdate}<br>`;

    for await (const tag of hashtags) {
      mediaOwner.innerHTML += tag.tag + ' ';
    }

    mediaOwnerProfilePic.src = 'data:image/jpeg;base64,' +
        media.profile_picture;
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
      commentOwnerProfilePic.src = 'data:image/jpeg;base64,' +
          comment.profile_picture;
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

    const heart = document.querySelector('.fa-heart');
    const likePopup = document.getElementById('likePopup');

    // Check if the currently logged in user has already liked this piece of media
    if (isToken) {
      const hasLiked = await getLikeStatus(media.id);

      if (hasLiked.result === true) {
        //User has already liked this media
        console.log('You have liked already.');
        heart.style.color = '#B00923';
      } else {
        heart.addEventListener('click', likeMedia);
        heart.style.cursor = 'pointer';
      }
    } else {
      heart.addEventListener('click', loginPromptToLike);
    }

    // When user presses heart, and hasn't liked before
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

    async function loginPromptToLike() {
      likePopup.classList.toggle('show');
    }

    // Add option to toggle map if the image has coordinates attached
    const locationButton = document.querySelector('.input-location');

    if (media.coords !== null) {
      try {
        const coords = JSON.parse(media.coords);
        await addMarker(coords);
        locationButton.style.color = 'green';
        locationButton.style.cursor = 'pointer';
        locationButton.addEventListener('click', showLocation);
      } catch (e) {
      }
    }

    async function showLocation() {
      modalMap.style.display = 'flex';
      bigCardImage.style.display = 'none';
      bigCardVideo.style.display = 'none';
      locationButton.removeEventListener('click', showLocation);
      locationButton.addEventListener('click', showImage);
    }

    async function showImage() {
      modalMap.style.display = 'none';
      bigCardImage.style.display = 'flex';
      bigCardVideo.style.display = 'flex';
      locationButton.addEventListener('click', showLocation);
      locationButton.removeEventListener('click', showImage);
    }

    // Select commentForm to add eventlistener to post a comment
    const commentForm = document.querySelector('.post-comment-form');
    const commentPopup = document.getElementById('commentPopup');

    if (isToken) {
      // User is logged in
      commentForm.addEventListener('submit', postComment);
    } else {
      // User isn't logged in
      commentForm.addEventListener('submit', loginPromptToComment);
    }

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
          commentOwnerProfilePic.src = 'data:image/jpeg;base64,' +
              comment.profile_picture;
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

    async function loginPromptToComment(e) {
      e.preventDefault();
      document.querySelector('.post-comment-textarea').value = '';
      commentPopup.classList.toggle('show');
    }

    // Close big card and clear it by using innerHTML
    bigCardCloseButton.addEventListener('click', async (e) => {
      await clearBigCard();
    });

    // For mobile version button
    bigCardMobileCloseButton.addEventListener('click', async (e) => {
      await clearBigCard();
    });

    async function clearBigCard() {
      bigCardModal.style.display = 'none';

      bigCardImage.remove();
      bigCardVideo.remove();
      modalMap.style.display = 'flex';
      if (marker !== undefined) {
        marker.remove();
      }
      userInfoDiv.innerHTML = '';
      description.innerHTML = '';
      bigCardComments.innerHTML = '';
      bigCardLikes.innerHTML = '';
      allComments.innerHTML = '';

      heart.style.color = '#8f8b8b';
      locationButton.style.color = '#8f8b8b';

      //Remove event listener from like button (heart)
      heart.removeEventListener('click', likeMedia);
      heart.removeEventListener('click', loginPromptToLike);

      //Remove event listener from location button
      locationButton.removeEventListener('click', showLocation);

      // Remove event listener from the form to not stack event listeners on top of same form
      commentForm.removeEventListener('submit', postComment);
      commentForm.removeEventListener('submit', loginPromptToComment);

      // Allow scrolling again
      body.style.overflow = 'visible';
    }

  } catch (e) {
    console.log(e.message);
  }
};

// Check for the token...if it exists do these
const isToken = (sessionStorage.getItem('token'));
const parseJwt = (isToken) => {
  try {
    return JSON.parse(atob(isToken.split('.')[1]));
  } catch (e) {
    return null;
  }
};

if (isToken) {
  const tokenStatus = parseJwt(isToken)
  console.log('date now: ', Date.now() / 1000);
  console.log('token iat:', tokenStatus.iat);
  if(Date.now() <  tokenStatus.exp * 1000) {
    console.log('setting user')
    getLoggedUser();
    setUserAslogged();
  } else {
    console.log('expired');
    doLogout();
  }
} else {
  console.log('No token, log in plz');
  //getAllMedia();
}

getSomeMedia();