'use strict';
const url = 'https://localhost:8000';
mapboxgl.accessToken = 'pk.eyJ1IjoicGV4aSIsImEiOiJja2hhN241bzYweXBtMnBuenA5Y3NxOGlmIn0.b1NkQwYNPY04r4MBe99rBQ';
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [24.92398406198174, 60.18035205606998], // starting position
  zoom: 7, // starting zoom
});
let marker;
const mapDiv = document.querySelector('#map');
const picsList = document.querySelector('#pics-list');
picsList.style.listStyle = 'none';
const picForm = document.querySelector('#add-pic-form');
const videoForm = document.querySelector('#add-video-form');
const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const searchForm = document.querySelector('#pic-search-form');
const but = document.querySelector('#but');
const but2 = document.querySelector('#but2');
const but3 = document.querySelector('#but3');
const but4 = document.querySelector('#but4');
const but5 = document.querySelector('#but5');
const but6 = document.querySelector('#but6');
const logOut = document.querySelector('#log-out');
logOut.style.display = 'none';
const interactionModal = document.querySelector('#interaction-modal');
const mapModal = document.querySelector('#map-modal');
const closeInteractionModal = document.querySelector(
    '#close-interaction-modal');   //<span> element that closes the modal
const closeMapModal = document.querySelector(
    '#close-map-modal');   //<span> element that closes the modal
const modalContent = document.querySelector('#modal-content');
const loginWrapper = document.querySelector('#login-wrapper');
const registerWrapper = document.querySelector('#register-wrapper');
const body = document.body;

closeInteractionModal.addEventListener('click', (evt) => {
  interactionModal.style.display = 'none';
  modalContent.removeChild(document.querySelector('#modalPic'));
  if (document.querySelector('#interactionModalLikeButton')) {
    modalContent.removeChild(
        document.querySelector('#interactionModalLikeButton'));
  }
  if (document.querySelector('#interactionModalDislikeButton')) {
    modalContent.removeChild(
        document.querySelector('#interactionModalDislikeButton'));
  }
  modalContent.removeChild(document.querySelector('#modalp'));
  modalContent.removeChild(document.querySelector('#modalForm'));
  modalContent.removeChild(document.querySelector('#modalMapButton'));
  if (document.querySelector('#newInteractionModalLikeButton')) {
    modalContent.removeChild(
        document.querySelector('#newInteractionModalLikeButton'));
  }
  if (document.querySelector('#newInteractionModalDislikeButton')) {
    modalContent.removeChild(
        document.querySelector('#newInteractionModalDislikeButton'));
  }
  body.style.overflow = 'visible';
});

closeMapModal.addEventListener('click', async (evt) => {
  evt.preventDefault();
  mapModal.style.display = 'none';
  marker.remove();
});

//Depending what is given as parameter into this function decides what cards are rendered
const createPicCards = async (pics) => {
  //Clear so if new picture is added, the whole json is loaded again and has to be rendered again
  picsList.innerHTML = '';
  try {

    for await (const pic of pics) {

      // If currently iterating item is of type image, not video
      if (pic.mediatype === 'image') {
        // Check if user has already liked this pic
        const getStatus = await getLikeStatus(pic.pic_id);
        const hasLiked = getStatus.result;
        console.log('User has liked this photo / video: ', hasLiked);

        const img = document.createElement('img');

        img.src = url + '/Thumbnails/' + pic.filename;

        //Create and Display modal on image click
        img.addEventListener('click', async (evt) => {
          body.style.overflow = 'hidden';
          console.log(`Clicked pic with an id of: ${pic.pic_id}`);
          interactionModal.style.display = 'block';

          const modalMapButton = document.createElement('button');
          modalMapButton.id = 'modalMapButton';
          modalMapButton.innerHTML = 'Display location';

          modalMapButton.addEventListener('click', async (evt) => {
            evt.preventDefault();
            console.log('mapbutton coords: ', pic.coords);
            mapModal.style.display = 'block';

            try {
              const coords = JSON.parse(pic.coords);
              addMarker(coords);
            } catch (e) {
            }
          });

          const modalp = document.createElement('p');
          modalp.id = 'modalp';

          const interactionModalLikeButton = document.createElement('span');
          interactionModalLikeButton.id = 'interactionModalLikeButton';

          const interactionModalDislikeButton = document.createElement('span');
          interactionModalDislikeButton.id = 'interactionModalDislikeButton';

          const modalForm = document.createElement('form');
          modalForm.id = 'modalForm';

          const modalInput = document.createElement('input');
          modalInput.id = 'modalInput';
          modalInput.style.width = '50%';
          modalInput.style.height = '5%';
          modalInput.id = 'modal-input';
          modalInput.type = 'text';
          modalInput.name = 'comment';
          modalInput.pattern = '.{3,}';
          modalInput.placeholder = 'Write your comment about this photo here';
          modalInput.required = true;

          const modalButton = document.createElement('button');
          modalButton.id = 'modalButton';
          modalButton.innerHTML = 'Comment';
          modalForm.appendChild(modalInput);
          modalForm.appendChild(modalButton);

          modalContent.appendChild(modalForm);
          modalContent.appendChild(modalMapButton);
          modalContent.appendChild(modalp);
          modalContent.appendChild(interactionModalLikeButton);
          modalContent.appendChild(interactionModalDislikeButton);

          //Get up to date likes and comments from database then assign the value to elements
          const updatedLikes = await getLikes(pic.pic_id);
          if (updatedLikes[0] === undefined) {
            interactionModalLikeButton.innerHTML = `0 &#x1F44D;`;
            interactionModalDislikeButton.innerHTML = `0 &#128078;`;
          } else {
            console.log(updatedLikes);
            interactionModalLikeButton.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;
            interactionModalDislikeButton.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;
          }


          const comments = await getComments(pic.pic_id);
          console.log(comments);

          // Create comments into modelp
          for await (const comment of comments) {
            const commentDiv = document.createElement('div');
            const commentp = document.createElement('p');
            //commentSpan.innerHTML = '<svg style="width: 20px; height: 20px" aria-hidden="true" focusable="false" data-prefix="fad" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 fa-3x"><g class="fa-group"><path fill="currentColor" d="M53.2 467L32 96h384l-21.2 371a48 48 0 0 1-47.9 45H101.1a48 48 0 0 1-47.9-45z" class="fa-secondary"></path><path fill="currentColor" d="M0 80V48a16 16 0 0 1 16-16h120l9.4-18.7A23.72 23.72 0 0 1 166.8 0h114.3a24 24 0 0 1 21.5 13.3L312 32h120a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16A16 16 0 0 1 0 80z" class="fa-primary"></path></g></svg>'
            //commentp.appendChild(commentSpan);
            commentp.innerHTML += `${comment.date} ${comment.name} ${comment.lastname}: ${comment.comment}`
            commentDiv.appendChild(commentp);

            const checkOwnerShip = async () => {
              const fetchOptions = {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                  'Content-Type': 'application/json',
                },
              };
              const response = await fetch(url + '/comments/commentuserid/' + comment.commentid,
                  fetchOptions);
              //console.log('owner status:', json);
              return await response.json();
            };

            // Check if the logged user owns the comment, if so make button to be allowed to delete the comment
            const checkOwner = await checkOwnerShip().then((result) => {
              if (result.result === true) {
                const commentSpan = document.createElement('span');
                commentSpan.innerHTML = `<svg style="width: 20px; height: 20px" aria-hidden="true" focusable="false" data-prefix="fad" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 fa-3x"><g class="fa-group"><path fill="currentColor" d="M53.2 467L32 96h384l-21.2 371a48 48 0 0 1-47.9 45H101.1a48 48 0 0 1-47.9-45z" class="fa-secondary"></path><path fill="currentColor" d="M0 80V48a16 16 0 0 1 16-16h120l9.4-18.7A23.72 23.72 0 0 1 166.8 0h114.3a24 24 0 0 1 21.5 13.3L312 32h120a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16A16 16 0 0 1 0 80z" class="fa-primary"></path></g></svg>`;
                commentSpan.addEventListener('click', async (evt) => {
                  console.log(`Delete pressed at ${comment.commentid}`);
                  try {
                    const options = {
                      method: 'DELETE',
                      headers: {
                        'Authorization': 'Bearer ' +
                            sessionStorage.getItem('token'),
                      },
                    };
                    console.log(options);
                    const response = await fetch(
                        url + '/comments/delete/' + comment.commentid, options);
                    const json = await response.json();
                    console.log('Delete response: ', json);
                    commentDiv.remove();
                  } catch (e) {
                    console.log(e.message);
                  }
                });
                commentDiv.appendChild(commentSpan);
              }
            });

            await checkOwner;


            commentDiv.style.border = 'thin solid #000000';
            modalp.appendChild(commentDiv);
          }


          //Like chosen photo if user hasn't liked before.
          if (!hasLiked) {
            interactionModalLikeButton.addEventListener('click',
                async (evt) => {
                  evt.preventDefault();

                  console.log(pic.pic_id);
                  try {
                    const options = {
                      method: 'POST',
                      headers: {
                        'Authorization': 'Bearer ' +
                            sessionStorage.getItem('token'),
                      },
                    };
                    console.log(options);
                    const response = await fetch(
                        url + '/likes/incrementlike/' + pic.pic_id, options);
                    const json = await response.json();
                    console.log('add like response', json);

                    //Fetch the updated like and update like amount
                    const updatedLikes = await getLikes(pic.pic_id);
                    // Remove element to get rid of event listener
                    interactionModalLikeButton.remove();
                    interactionModalDislikeButton.remove();
                    const newInteractionModalLikeButton = document.createElement(
                        'span');
                    const newInteractionModalDislikeButton = document.createElement(
                        'span');
                    newInteractionModalLikeButton.id = 'newInteractionModalLikeButton';
                    newInteractionModalDislikeButton.id = 'newInteractionModalDislikeButton';
                    newInteractionModalLikeButton.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;
                    newInteractionModalDislikeButton.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;
                    modalp.after(newInteractionModalLikeButton);
                    newInteractionModalLikeButton.after(
                        newInteractionModalDislikeButton);

                    //... to outside the modal too
                    likes.remove();
                    dislikes.remove();
                    const newLikes = document.createElement('p');
                    const newDislikes = document.createElement('span');
                    newLikes.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;
                    newDislikes.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;
                    img.after(newLikes);
                    newLikes.after(newDislikes);

                  } catch (e) {
                    console.log(e.message);
                  }
                });

            //Dislike chosen photo
            interactionModalDislikeButton.addEventListener('click',
                async (evt) => {
                  evt.preventDefault();

                  console.log(pic.pic_id);
                  try {
                    const options = {
                      method: 'POST',
                      headers: {
                        'Authorization': 'Bearer ' +
                            sessionStorage.getItem('token'),
                      },
                    };
                    console.log(options);
                    const response = await fetch(
                        url + '/likes/incrementdislike/' + pic.pic_id, options);
                    const json = await response.json();
                    console.log('add like response', json);

                    //Fetch the updated dislike and update dislike amount
                    const updatedLikes = await getLikes(pic.pic_id);
                    interactionModalLikeButton.remove();
                    interactionModalDislikeButton.remove();
                    const newInteractionModalLikeButton = document.createElement(
                        'span');
                    const newInteractionModalDislikeButton = document.createElement(
                        'span');
                    newInteractionModalLikeButton.id = 'newInteractionModalLikeButton';
                    newInteractionModalDislikeButton.id = 'newInteractionModalDislikeButton';
                    newInteractionModalLikeButton.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;
                    newInteractionModalDislikeButton.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;
                    modalp.after(newInteractionModalLikeButton);
                    newInteractionModalLikeButton.after(
                        newInteractionModalDislikeButton);

                    //... to outside the modal too
                    likes.remove();
                    dislikes.remove();
                    const newLikes = document.createElement('p');
                    const newDislikes = document.createElement('span');
                    newLikes.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;
                    newDislikes.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;
                    img.after(newLikes);
                    newLikes.after(newDislikes);

                  } catch (e) {
                    console.log(e.message);
                  }
                });
          }
          //Post a comment to selected photo
          modalForm.addEventListener('submit', async (evt) => {
            evt.preventDefault();
            const data = serializeJson(modalForm);
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
                url + `/comments/${pic.pic_id}`, fetchOptions);
            const json = await response.json();
            console.log('add comment response', json);

            // Update comments into modal in real time after posting comment
            const comments = await getComments(pic.pic_id);
            console.log(comments);
            modalp.innerHTML = '';

            // Create comments into modelp
            for await (const comment of comments) {
              const commentDiv = document.createElement('div');
              const commentp = document.createElement('p');
              //commentSpan.innerHTML = '<svg style="width: 20px; height: 20px" aria-hidden="true" focusable="false" data-prefix="fad" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 fa-3x"><g class="fa-group"><path fill="currentColor" d="M53.2 467L32 96h384l-21.2 371a48 48 0 0 1-47.9 45H101.1a48 48 0 0 1-47.9-45z" class="fa-secondary"></path><path fill="currentColor" d="M0 80V48a16 16 0 0 1 16-16h120l9.4-18.7A23.72 23.72 0 0 1 166.8 0h114.3a24 24 0 0 1 21.5 13.3L312 32h120a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16A16 16 0 0 1 0 80z" class="fa-primary"></path></g></svg>'
              //commentp.appendChild(commentSpan);
              commentp.innerHTML += `${comment.date} ${comment.name} ${comment.lastname}: ${comment.comment}`
              commentDiv.appendChild(commentp);

              const checkOwnerShip = async () => {
                const fetchOptions = {
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json',
                  },
                };
                const response = await fetch(url + '/comments/commentuserid/' + comment.commentid,
                    fetchOptions);
                //console.log('owner status:', json);
                return await response.json();
              };

              // Check if the logged user owns the comment, if so make button to be allowed to delete the comment
              const checkOwner = await checkOwnerShip().then((result) => {
                if (result.result === true) {
                  const commentSpan = document.createElement('span');
                  commentSpan.innerHTML = `<svg style="width: 20px; height: 20px" aria-hidden="true" focusable="false" data-prefix="fad" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 fa-3x"><g class="fa-group"><path fill="currentColor" d="M53.2 467L32 96h384l-21.2 371a48 48 0 0 1-47.9 45H101.1a48 48 0 0 1-47.9-45z" class="fa-secondary"></path><path fill="currentColor" d="M0 80V48a16 16 0 0 1 16-16h120l9.4-18.7A23.72 23.72 0 0 1 166.8 0h114.3a24 24 0 0 1 21.5 13.3L312 32h120a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16A16 16 0 0 1 0 80z" class="fa-primary"></path></g></svg>`;
                  commentSpan.addEventListener('click', async (evt) => {
                    console.log(`Delete pressed at ${comment.commentid}`);
                    try {
                      const options = {
                        method: 'DELETE',
                        headers: {
                          'Authorization': 'Bearer ' +
                              sessionStorage.getItem('token'),
                        },
                      };
                      console.log(options);
                      const response = await fetch(
                          url + '/comments/delete/' + comment.commentid, options);
                      const json = await response.json();
                      console.log('Delete response: ', json);
                      commentDiv.remove();
                    } catch (e) {
                      console.log(e.message);
                    }
                  });
                  commentDiv.appendChild(commentSpan);
                }
              });

              await checkOwner;


              commentDiv.style.border = 'thin solid #000000';
              modalp.appendChild(commentDiv);
            }



            /*
            comments.forEach((comment) => {
              modalp.innerHTML += `<p>${comment.date} ${comment.name} ${comment.lastname}: ${comment.comment}</p>`;
            });*/
          });

          //Append clicked image to the opening modal
          const modalPic = document.createElement('img');
          modalPic.src = img.src = url + '/Thumbnails/' + pic.filename;
          modalPic.id = 'modalPic';
          modalContent.insertBefore(modalPic, modalContent.firstChild);

        });

        const likes = document.createElement('p');
        likes.id = 'likes';
        const dislikes = document.createElement('span');
        const updatedLikes = await getLikes(pic.pic_id);
        if (updatedLikes[0] === undefined) {
          likes.innerHTML = '0 &#x1F44D;';
          dislikes.innerHTML = '0 &#128078;';
        } else {
          likes.innerHTML = updatedLikes[0].likes + '&#x1F44D;';
          dislikes.innerHTML = updatedLikes[0].dislikes + '&#128078;';
        }

        // Incrementing for the main like button outside of modal if user hasn't liked before
        if (!hasLiked) {
          likes.addEventListener('click', async (evt) => {
            evt.preventDefault();

            console.log(pic.pic_id);
            try {
              const options = {
                method: 'POST',
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
              };
              console.log(options);
              const response = await fetch(
                  url + '/likes/incrementlike/' + pic.pic_id, options);
              const json = await response.json();
              console.log('add like response', json);

              const updatedLikes = await getLikes(pic.pic_id);
              likes.remove();
              dislikes.remove();
              const newLikes = document.createElement('p');
              const newDislikes = document.createElement('span');
              newLikes.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;
              newDislikes.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;
              img.after(newLikes);
              newLikes.after(newDislikes);

            } catch (e) {
              console.log(e.message);
            }
          });

          // Incrementing for the main dislike button outside of modal
          dislikes.addEventListener('click', async (evt) => {
            evt.preventDefault();

            console.log(pic.pic_id);
            try {
              const options = {
                method: 'POST',
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
              };
              console.log(options);
              const response = await fetch(
                  url + '/likes/incrementdislike/' + pic.pic_id, options);
              const json = await response.json();
              console.log('add like response', json);

              //const updatedLikes = await getLikes(pic.pic_id);
              //dislikes.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;

              const updatedLikes = await getLikes(pic.pic_id);
              likes.remove();
              dislikes.remove();
              const newLikes = document.createElement('p');
              const newDislikes = document.createElement('span');
              newLikes.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;
              newDislikes.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;
              img.after(newLikes);
              newLikes.after(newDislikes);

            } catch (e) {
              console.log(e.message);
            }
          });
        }

        const description = document.createElement('p');
        description.innerHTML = pic.description;

        const owner = document.createElement('p');
        const postDate = pic.post_date;//.replace('T', ' ').replace('Z', '');
        owner.innerHTML = `Posted by ${pic.name} ${pic.lastname} on ${postDate}`;

        const coords = document.createElement('p');
        coords.innerHTML = pic.coords;

        const date = document.createElement('p');
        const photoTakenDate = pic.date;//.replace('T', ' ').replace('Z', '');
        date.innerHTML = `Photo taken: ${photoTakenDate}`;

        const li = document.createElement('li');

        li.appendChild(img);
        li.appendChild(likes);
        li.appendChild(dislikes);
        li.appendChild(description);
        li.appendChild(owner);
        li.appendChild(coords);
        li.appendChild(date);

        // Used to check if currently logged in user owner of the pic (or admin)
        const checkOwnerShip = async () => {
          const fetchOptions = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
              'Content-Type': 'application/json',
            },
          };
          const response = await fetch(url + '/pic/picuserid/' + pic.pic_id,
              fetchOptions);
          //console.log('owner status:', json);
          return await response.json();
        };

        // Check if the logged user owns the photo, if so make button to be allowed to delete the photo
        const checkOwner = await checkOwnerShip().then((result) => {
          if (result.result === true) {
            const deletePicButton = document.createElement('p');
            deletePicButton.innerHTML = `<svg style="width: 20px; height: 20px" aria-hidden="true" focusable="false" data-prefix="fad" data-icon="trash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash fa-w-14 fa-3x"><g class="fa-group"><path fill="currentColor" d="M53.2 467L32 96h384l-21.2 371a48 48 0 0 1-47.9 45H101.1a48 48 0 0 1-47.9-45z" class="fa-secondary"></path><path fill="currentColor" d="M0 80V48a16 16 0 0 1 16-16h120l9.4-18.7A23.72 23.72 0 0 1 166.8 0h114.3a24 24 0 0 1 21.5 13.3L312 32h120a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16A16 16 0 0 1 0 80z" class="fa-primary"></path></g></svg>`;
            deletePicButton.addEventListener('click', async (evt) => {
              evt.preventDefault();
              console.log(`Delete pressed at ${pic.pic_id}`);
              try {
                const options = {
                  method: 'DELETE',
                  headers: {
                    'Authorization': 'Bearer ' +
                        sessionStorage.getItem('token'),
                  },
                };
                console.log(options);
                const response = await fetch(
                    url + '/pic/delete/' + pic.pic_id, options);
                const json = await response.json();
                console.log('Delete response: ', json);

              } catch (e) {
                console.log(e.message);
              }
              // Refresh after deleting something.
              await getPicsByOwner();
            });
            li.appendChild(deletePicButton);
          }
        });
        await checkOwner;

        picsList.appendChild(li);

      } else {
        const video = document.createElement('video');

        video.src = url + '/Uploads/' + pic.filename;
        video.width = 500;
        video.height = 300;
        video.controls = true;

        const description = document.createElement('p');
        description.innerHTML = pic.description;

        const owner = document.createElement('p');
        const postDate = pic.post_date.replace('T', ' ').replace('Z', '');
        owner.innerHTML = `Posted by ${pic.name} ${pic.lastname} on ${postDate}`;

        const li = document.createElement('li');

        li.appendChild(video);
        li.appendChild(description);
        li.appendChild(owner);

        picsList.appendChild(li);
      }
    }
  } catch (e) {
    console.log(e.message);
  }
};

const createVideoCards = async (videos) => {
  //Clear so if new a new video is added, the whole json is loaded again and has to be rendered again
  picsList.innerHTML = '';
  try {

    for await (const vid of videos) {

      const video = document.createElement('video');

      video.src = url + '/Uploads/' + vid.filename;
      video.width = 500;
      video.height = 300;
      video.controls = true;

      const description = document.createElement('p');
      description.innerHTML = vid.description;

      const owner = document.createElement('p');
      const postDate = vid.post_date.replace('T', ' ').replace('Z', '');
      owner.innerHTML = `Posted by ${vid.name} ${vid.lastname} on ${postDate}`;

      const li = document.createElement('li');

      li.appendChild(video);
      li.appendChild(description);
      li.appendChild(owner);

      picsList.appendChild(li);

    }

  } catch (e) {
    console.log(e.message);
  }
};

// Returns all pics starting from newest
const getAllPicks = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/pic/pics', options);
    const pics = await response.json();
    console.log(pics);
    await createPicCards(pics);
  } catch (e) {
    console.log(e.message);
  }
};

// Get all pikes by their like count
const getAllPicksByMostLikes = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/pic/mostlikes', options);
    const pics = await response.json();
    console.log(pics);
    await createPicCards(pics);
  } catch (e) {
    console.log(e.message);
  }
};

// get users
const getUsers = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user', options);
    const users = await response.json();
    console.log(users);
  } catch (e) {
    console.log(e.message);
  }
};

const getAllVideos = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/pic/videos', options);
    const videos = await response.json();
    console.log(videos);
    await createVideoCards(videos);
  } catch (e) {
    console.log(e.message);
  }
};

// Create a pic and likes related to that pic
picForm.addEventListener('submit', async (evt) => {
  //Create the pic
  evt.preventDefault();
  const fd = new FormData(picForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/pic', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  console.log('json.pick_id', json.pic_id);

  // Create the likes and dislikes for pic
  /*
  const likeCreationOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  const setLikes = await fetch(url + '/likes/' + json.pic_id,
      likeCreationOptions);
  const interactionJson = await setLikes.json();
  console.log('add response', interactionJson);
*/
});

// Create a video
videoForm.addEventListener('submit', async (evt) => {
  //Create the pic
  evt.preventDefault();
  const fd = new FormData(videoForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/video', fetchOptions);
  const json = await response.json();
  console.log('add video response', json);
  console.log('json.video_id', json.video_id);
});

// Register
registerForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(registerForm);
  //const fd = new FormData(registerForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  console.log(fetchOptions);
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  // Save token
  sessionStorage.setItem('token', json.token);
});

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
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
    alert(json.message);
  } else {
    //Set token
    sessionStorage.setItem('token', json.token);
    console.log('token: ', sessionStorage.getItem('token'));

    // Hide login and registration forms
    loginWrapper.style.display = 'none';
    registerWrapper.style.display = 'none';
    logOut.style.display = 'block';

    await getPicsByOwner();
  }
});

// Get pics by owner
const getPicsByOwner = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/pic/userpics', options);
    const pics = await response.json();
    console.log(pics);
    await createPicCards(pics);
  } catch (e) {
    console.log(e.message);
  }
};

//Logout logged in user
logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
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
    alert('You have logged out');
    picsList.innerHTML = '';
    // Show login and registration forms again
    loginWrapper.style.display = 'block';
    registerWrapper.style.display = 'block';
    logOut.style.display = 'none';

  } catch (e) {
    console.log(e.message);
  }
});

//Works as expected after db modifications
const getLikes = async (pic_id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/likes/' + pic_id,
        options);
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
};

const getLikeStatus = async (pic_id) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url + '/likes/likestatus/' + pic_id, options);
    return await response.json();
  } catch (e) {
    console.error(e.message);
  }
};

const getComments = async (pic_id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/comments/' + pic_id,
        options);
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
};

const addMarker = (coords) => {
  map.setCenter(coords);
  marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
};

// Search form
searchForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
  };
  console.log(fetchOptions);
  const response = await fetch(
      url + '/pic/search/' + document.querySelector('#search-input').value,
      fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  await createPicCards(json);
});

//For now the webpage loads the pictures owned by the logged in user
//Change called function to adjust
const isToken = (sessionStorage.getItem('token'));
// Check for the token...if it exists do these
if (isToken) {
  getPicsByOwner().then(() => {
    loginWrapper.style.display = 'none';
    registerWrapper.style.display = 'none';
    logOut.style.display = 'block';
  });
} else {
  console.log('No token, log in plz');
}

//Search for all pics
but.addEventListener('click', async (evt) => {
  evt.preventDefault();
  await getAllPicks();
});

but2.addEventListener('click', async (evt) => {
  evt.preventDefault();
  await getPicsByOwner();
});

but3.addEventListener('click', async (evt) => {
  evt.preventDefault();
  await getAllPicksByMostLikes();
});

but4.addEventListener('click', async (evt) => {
  mapModal.style.display = 'block';
});

but5.addEventListener('click', async (evt) => {
  evt.preventDefault();
  await getAllVideos();
});

but6.addEventListener('click', async (evt) => {
  evt.preventDefault();
  try {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url + '/user/check/userlogged', fetchOptions);
    const json = await response.json();
    console.log('getLogin response', json);
  } catch (e) {
    console.error(e.message);
  }
});


