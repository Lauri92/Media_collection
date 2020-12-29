'use strict';
const url = 'https://localhost:8000';
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
const bigCardCloseButton = document.querySelector('.close-button');
const bigCardMobileCloseButton = document.querySelector('.mobile-close-button');
const bigCardMobileDeleteButton = document.querySelector('.fa-trash');
const closeButtons = document.getElementsByClassName('fa-times');
const imageAmountButton = document.querySelector('.image-amount');
const videoAmountButton = document.querySelector('.video-amount');
const userProfilePicButton = document.querySelector('.user-profile-pic');
const deleteButton = document.querySelector('.delete-button');
const cancelButton = document.querySelector('.cancel-button');
const deleteCloseButton = document.querySelector('#delete-close-button');

//Modals
const addMediaModal = document.querySelector('#add-media-modal');
const bigCardModal = document.querySelector('.modal');
const changeProfilePicModal = document.querySelector(
    '#change-profile-pic-modal');
const deleteMediaModal = document.querySelector('#delete-media-modal');

// Forms
const addMediaForm = document.querySelector('#add-media-form');
const changeProfilePicForm = document.querySelector('#change-profile-pic-form');

// Misc
const imgInput = document.querySelector('.img-input');
const profilePicInput = document.querySelector('.profile-pic-input');
// Keep track of AJAX call if true -> AJAX call still happening, don't allow new one
let isLoading = false;

// Get images of logged in user
const getUserImages = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    if (isLoading === false) {
      isLoading = true;
      const response = await fetch(url + '/media/specifiedusermedia/image',
          options);
      const media = await response.json();
      console.log(media);
      await createMediaCards(media);
      isLoading = false;
    } else {
      console.log('Another request processing.');
    }
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
    if (isLoading === false) {
      isLoading = true;
      const response = await fetch(url + '/media/specifiedusermedia/video',
          options);
      const media = await response.json();
      console.log(media);
      await createMediaCards(media);
      isLoading = false;
    } else {
      console.log('Another request processing.');
    }
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

// Adjust nav-bar elements if user has a json web-token
function setUserAslogged() {
  loginButton.style.display = 'none';
  registerButton.style.display = 'none';
  logoutButton.style.display = 'flex';
  profileButton.style.display = 'flex';
  addMediaButton.style.display = 'flex';
}

// Get logged in users data
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

    // Clear img tag, needed to do in case user updates profile picture
    profileButton.innerHTML = '';
    // Set profile picture in nav bar and in profile picture holder
    const profileImg = document.createElement('img');
    const bigProfileImg = document.querySelector('.user-profile-pic');
    bigProfileImg.src = `./Profilepics/${userInfo.profile_picture}`;
    profileImg.src = `./Profilepics/${userInfo.profile_picture}`;
    profileButton.appendChild(profileImg);

    // Set username in user page
    const username = document.querySelector('.user-name');
    username.innerHTML = `${userInfo.name} ${userInfo.lastname}`;

    // Set email in user page
    const userEmail = document.querySelector('.user-email');
    userEmail.innerHTML = `${userInfo.email}`;

  } catch (e) {
    console.log(e.message);
  }
};

const addMarker = async (coords) => {
  map.setCenter(coords);
  map.setZoom(7);
  marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
};

// All elements with class fa-times will get this eventlistener. (login, register, addMedia)
Array.from(closeButtons).forEach(function(button) {
  button.addEventListener('click', closeModals);
});

// Open modal for adding media
addMediaButton.addEventListener('click', async (e) => {
  console.log('clicked');
  addMediaModal.style.display = 'flex';
  body.style.overflow = 'hidden';
});

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
  await getUserImagesCount();
  await getUserVideosCount();
  addMediaForm.reset();
  document.querySelector('#fileinput-form-control').value = '';
  document.querySelector('.to-be-uploaded-media').src = '';
  addMediaModal.style.display = 'none';
  body.style.overflow = 'visible';
});

// Open modal for changing profile picture
userProfilePicButton.addEventListener('click', async () => {
  console.log('Clicked big profile picture');
  changeProfilePicModal.style.display = 'flex';
});

// Set thumbnail of to-be-uploaded profile-pic
profilePicInput.onchange = function() {
  const reader = new FileReader();
  // TODO: Check for video file too
  reader.onload = function(e) {
    // Get loaded data and render thumbnail.
    document.querySelector('.to-be-uploaded-profile-pic').src = e.target.result;
  };

  // Read the image file as a data URL.
  reader.readAsDataURL(this.files[0]);
};

// Change profile pic request
changeProfilePicForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Attempt to change profile pic');
  e.preventDefault();
  const fd = new FormData(changeProfilePicForm);
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/user', fetchOptions);
  const json = await response.json();
  console.log('change profilepic response', json);
  closeModals();
  document.querySelector('.cards').innerHTML = '';
  await getLoggedUser();
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
    window.location.href = 'index.html';

  } catch (e) {
    console.log(e.message);
  }
});

// Get users images
imageAmountButton.addEventListener('click', async () => {
  await getUserImages();
});

// Get users videos
videoAmountButton.addEventListener('click', async () => {
  await getUserVideos();
});

// Function to be called when closing modals
function closeModals() {
  addMediaModal.style.display = 'none';
  changeProfilePicModal.style.display = 'none';
  deleteMediaModal.style.display = 'none';
  body.style.overflow = 'visible';
}

// Check for the token...if it exists do these
const isToken = (sessionStorage.getItem('token'));

// Create UI for the logged in user
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
  const smallcardH2 = document.createElement('h2');
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

  // Add text which indicates possibility of removing hovered media
  smallcardH2.innerHTML = 'DELETE';

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

  smallCardInfo.appendChild(smallcardH2);
  smallCardInfo.appendChild(smallCardH1);
  smallCardInfo.appendChild(smallCardP);

  smallCardDiv.appendChild(smallCardInfo);
  cards.appendChild(smallCardDiv);

  // Add event listener to DELETE text to allow deletion of media
  smallcardH2.addEventListener('click', async (e) => {
    e.stopPropagation();  // Stop element below being clickable too
    console.log(`Clicked DELETE @ media with id ${media.id}`);

    deleteMediaModal.style.display = 'flex';
    deleteButton.addEventListener('click', deletePic);
    cancelButton.addEventListener('click', leaveDeleteModal);
    deleteCloseButton.addEventListener('click', leaveDeleteModal);

    // Check what we are deleting and create appropriate deletion thumbnail
    if (media.mediatype === 'image') {
      const smallCardMediaDeleteThumbnail = document.createElement('img');
      smallCardMediaDeleteThumbnail.id = 'smallCardMediaDeleteThumbnail';
      smallCardMediaDeleteThumbnail.src = '/Thumbnails/' + media.filename;
      const deleteMediaForm = document.querySelector('#delete-media-form');
      deleteMediaForm.insertBefore(smallCardMediaDeleteThumbnail,
          deleteMediaForm.firstChild);
    } else {
      const smallCardMediaDeleteThumbnail = document.createElement('video');
      smallCardMediaDeleteThumbnail.id = 'smallCardMediaDeleteThumbnail';
      smallCardMediaDeleteThumbnail.src = '/Uploads/' + media.filename;
      const deleteMediaForm = document.querySelector('#delete-media-form');
      deleteMediaForm.insertBefore(smallCardMediaDeleteThumbnail,
          deleteMediaForm.firstChild);
    }

    async function deletePic() {
      console.log(`deleteButton @ ${media.id} pressed.`);
      try {
        const options = {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        };
        console.log(options);
        const response = await fetch(
            url + '/media/delete/' + media.id, options);
        const json = await response.json();
        console.log('Delete response: ', json);
        body.style.overflow = 'visible';
        deleteMediaModal.style.display = 'none';
        if (media.mediatype === 'image') {
          await getUserImages();
        } else {
          await getUserVideos();
        }
      } catch (e) {
        console.log(e.message);
      }
    }

    async function leaveDeleteModal() {
      console.log(`cancelButton @ ${media.id} pressed.`);
      console.log(`deleteCloseButton @ ${media.id} pressed.`);
      deleteMediaModal.style.display = 'none';
      deleteButton.removeEventListener('click', deletePic);
      cancelButton.removeEventListener('click', leaveDeleteModal);
      deleteCloseButton.removeEventListener('click', leaveDeleteModal);
      //deletePicThumbnail.remove();
      document.querySelector('#smallCardMediaDeleteThumbnail').remove();
    }

  });

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
    // Resize the map because it was opened in an initially hidden div and hide again
    const modalMap = document.querySelector('#map');
    map.resize();
    modalMap.style.display = 'none';

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
    // Media owner info and post date and hashtags
    const hashtags = await getHashtags(media.id);
    const userInfoDiv = document.querySelector('.user-info');
    const mediaOwner = document.createElement('p');
    const mediaOwnerProfilePic = document.createElement('img');
    const postdate = media.post_date.replace('T', ' ').
        replace('Z', '').
        slice(0, -7);

    // Add owner info and hastags
    mediaOwner.innerHTML = `${media.name} ${media.lastname} @ ${postdate}<br>`;
    for await (const tag of hashtags) {
      mediaOwner.innerHTML += tag.tag + ' ';
    }

    mediaOwnerProfilePic.src = `./Profilepics/${media.profile_picture}`;
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
      commentOwnerProfilePic.src = `./Profilepics/${comment.profile_picture}`;
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
      } else {
        // Has likes
        bigCardLikes.innerHTML = `${mediaLikes[0].likes}`;
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
          commentOwnerProfilePic.src = `./Profilepics/${comment.profile_picture}`;
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

    // Add event listener for deleting pics in mobile view
    // Button which opens the delete modal
    bigCardMobileDeleteButton.addEventListener('click', openDeleteModal);

    async function openDeleteModal() {
      console.log(`Clicked DELETE @ media with id ${media.id}`);
      console.log('bigCardMobileDeleteButton pressed');
      // Show the deletion modal
      deleteMediaModal.style.display = 'flex';
      // Button which deletes
      deleteButton.addEventListener('click', deletePic);
      // Buttons which leaves from the delete modal
      cancelButton.addEventListener('click', leaveDeleteModal);
      deleteCloseButton.addEventListener('click', leaveDeleteModal);

      // Check what the user is deleting to create appropriate deletion thumbnail for image / video
      if (media.mediatype === 'image') {
        const deleteMediaThumbnail = document.createElement('img');
        deleteMediaThumbnail.id = 'delete-media-thumbnail';
        deleteMediaThumbnail.src = '/Thumbnails/' + media.filename;
        const deleteMediaForm = document.querySelector('#delete-media-form');
        deleteMediaForm.insertBefore(deleteMediaThumbnail,
            deleteMediaForm.firstChild);
      } else {
        const deleteMediaThumbnail = document.createElement('video');
        deleteMediaThumbnail.id = 'delete-media-thumbnail';
        deleteMediaThumbnail.src = '/Uploads/' + media.filename;
        const deleteMediaForm = document.querySelector('#delete-media-form');
        deleteMediaForm.insertBefore(deleteMediaThumbnail,
            deleteMediaForm.firstChild);
      }

    }

    async function deletePic() {
      console.log(`deleteButton @ ${media.id} pressed.`);
      try {
        const options = {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        };
        console.log(options);
        const response = await fetch(
            url + '/media/delete/' + media.id, options);
        const json = await response.json();
        console.log('Delete response: ', json);
      } catch (e) {
        console.log(e.message);
      }
    }

    // Clear event listeners from opened modal, also remove the image representing the image to be removed
    async function leaveDeleteModal() {
      console.log(`cancelButton @ ${media.id} pressed.`);
      console.log(`deleteCloseButton @ ${media.id} pressed.`);
      deleteMediaModal.style.display = 'none';
      deleteButton.removeEventListener('click', deletePic);
      cancelButton.removeEventListener('click', leaveDeleteModal);
      deleteCloseButton.removeEventListener('click', leaveDeleteModal);
      document.querySelector('#delete-media-thumbnail').remove();
    }

    // Close big card and clear it by using innerHTML
    bigCardCloseButton.addEventListener('click', async (e) => {
      await clearBigCard();
    });

    //Visible only in mobile view
    bigCardMobileCloseButton.addEventListener('click', async (e) => {
      bigCardMobileDeleteButton.removeEventListener('click', openDeleteModal);
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

      //Remove event listener from location button
      locationButton.removeEventListener('click', showLocation);

      // Remove event listener from the form to not stack event listeners on top of same form
      commentForm.removeEventListener('submit', postComment);

      // Allow scrolling again
      body.style.overflow = 'visible';
    }

  } catch (e) {
    console.log(e.message);
  }
};