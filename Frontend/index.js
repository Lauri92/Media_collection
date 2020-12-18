'use strict';
const url = 'https://localhost:8000';

// Buttons
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');
const profileButton = document.querySelector('#profile-button');
const addMediaButton = document.querySelector('#add-media-button');
const closeButtons = document.getElementsByClassName('fa-times');

//Modals
const loginModal = document.querySelector('#login-modal');
const registerModal = document.querySelector('#register-modal');
const addMediaModal = document.querySelector('#add-media-modal');

// Forms
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const addMediaForm = document.querySelector('#add-media-form');

// Misc
const imgInput = document.querySelector('#img-input');

// Check for the token...if it exists do these
const isToken = (sessionStorage.getItem('token'));
if (isToken) {
  setUserAslogged();
} else {
  console.log('No token, log in plz');
}

/**
 * Function to create media cards on the page
 */
const createMediaCards = async (content) => {
  console.log(content);
  try {
    for await (const media of content) {

      if (media.mediatype === 'image') {

        try {
          // Create small cards
          await createSmallCards(media);

        } catch (e) {
          console.log(e.message);
        }

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

//Logout logged user
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

  } catch (e) {
    console.log(e.message);
  }
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
  evt.preventDefault();

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
      await setUserAslogged();
    }
  } catch (e) {
    console.log(e.message);
  }
});

// Register request
// TODO: Add check for token before registering
registerForm.addEventListener('submit', async (e) => {
  evt.preventDefault();

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
  console.log('json.pick_id', json.pic_id);
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

/**
 * Functions for utility
 */
// Adjust nav-bar elements if user has a json web-token
function setUserAslogged() {
  loginModal.style.display = 'none';
  loginButton.style.display = 'none';
  registerButton.style.display = 'none';
  logoutButton.style.display = 'block';
  profileButton.style.display = 'block';
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

getAllMedia();

const createSmallCards = async (media) => {
  // Get all likes of the image
  const mediaLikes = await getLikes(media.pic_id);
  //console.log(mediaLikes[0]);

  const cards = document.querySelector('.cards');     //Container for all the cards
  const smallCardDiv = document.createElement('div');
  smallCardDiv.className = 'card';
  const smallCardImg = document.createElement('img');
  const smallCardInfo = document.createElement('div');
  smallCardInfo.className = 'info';
  const smallCardH1 = document.createElement('h1');
  const smallCardP = document.createElement('p');

  // Place information to cards
  smallCardImg.src = url + '/Thumbnails/' + media.filename;
  smallCardH1.innerHTML = `${media.name} ${media.lastname}`;

  // Some media have no likes yet
  if (mediaLikes.likes !== undefined) {
    smallCardP.innerHTML = `Likes ${mediaLikes[0].likes}`;
  } else {
    smallCardP.innerHTML = `Likes 0`
  }
  smallCardInfo.appendChild(smallCardH1);
  smallCardInfo.appendChild(smallCardP);

  smallCardDiv.appendChild(smallCardImg);
  smallCardDiv.appendChild(smallCardInfo);
  cards.appendChild(smallCardDiv);

  smallCardDiv.addEventListener('click', async () => {
    console.log(`Clicked media with id of ${media.pic_id}`);
    try {
      await createBigCard(media.pic_id);
    } catch (e) {
      console.log(e.message);
    }
  });
};

const createBigCard = async (media) => {
  console.log(media);
}