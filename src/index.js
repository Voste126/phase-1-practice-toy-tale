let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById('toy-collection');

  // Making a GET request to retrieve toys from the JSON database
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      // Iterate over each toy and create the card elements
      toys.forEach(toy => {
        //create the card division
        const card = document.createElement('div');
        card.className = 'card';
        //heading
        const name = document.createElement('h2');
        name.textContent = toy.name;
        //image 
        const image = document.createElement('img');
        image.className = 'toy-avatar';
        image.src = toy.image;
        //number of likes
        const likes = document.createElement('p');
        likes.textContent = `${toy.likes} Likes`;
        //button of likes
        const likeBtn = document.createElement('button');
        likeBtn.className = 'like-btn';
        likeBtn.id = toy.id;
        likeBtn.textContent = 'Like ❤️';
        //apend the elements to the individual cards
        card.appendChild(name);
        card.appendChild(image);
        card.appendChild(likes);
        card.appendChild(likeBtn);
        //append the card division to the toy collection division
        toyCollection.appendChild(card);
      });
    });
//To create the new toy using the POST method 
//declearation of the form
  const toyForm = document.querySelector('.add-toy-form');
//event lisner to the submit button
  toyForm.addEventListener('submit', event => {
    event.preventDefault();
// the field id where the new data is added
    const nameInput = document.getElementById('toy_name');
    const imageInput = document.getElementById('img');
//the new values for the toy
    const newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0
    };
// POST declarations
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(createdToy => {
        const card = document.createElement('div');
        card.className = 'card';
        // do the same as the above get method to add the new record 
        const name = document.createElement('h2');
        name.textContent = createdToy.name;
        //img
        const image = document.createElement('img');
        image.className = 'toy-avatar';
        image.src = createdToy.image;
        //paragrapgh
        const likes = document.createElement('p');
        likes.textContent = `${createdToy.likes} Likes`;
        //button
        const likeBtn = document.createElement('button');
        likeBtn.className = 'like-btn';
        likeBtn.id = createdToy.id;
        likeBtn.textContent = 'Like ❤️';
        //append the values of new div
        card.appendChild(name);
        card.appendChild(image);
        card.appendChild(likes);
        card.appendChild(likeBtn);
        //append the new toy
        toyCollection.appendChild(card);

        // Clear the input values
        nameInput.value = "";
        imageInput.value = "";
      })
      .catch(error => {
        console.log("Error adding new toy:", error);
      });
  });
//the event lisner to toggle and add records 
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyCollection.addEventListener('click', event => {
    // Check if the clicked element has the class 'like-btn'
    if (event.target.classList.contains('like-btn')) {
      const likeButton = event.target;
      const toyCard = likeButton.parentNode;
      const likesElement = toyCard.querySelector('p');
      const toyId = likeButton.id;
  
      // Get the current number of likes from the 'p' element
      const currentLikes = parseInt(likesElement.textContent);
  
      // Increment the number of likes by 1
      const newNumberOfLikes = currentLikes++;
  
      // Send a PATCH request to update the toy's likes
      fetch(`http://localhost:3000/toys/:id`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          likes: newNumberOfLikes
        })
      })
        .then(response => response.json())
        .then(updatedToy => {
          // Update the number of likes in the DOM
          likesElement.textContent = `${updatedToy.likes} Likes`;
        })
        .catch(error => {
          console.log('Error updating toy likes:', error);
        });
    }
  });
  
  
});
