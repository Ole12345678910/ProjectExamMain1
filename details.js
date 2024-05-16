// Define the fetchApi function
async function fetchApi(apiKey) {
  const options = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };

  try {
    const response = await fetch(
      "https://v2.api.noroff.dev/blog/posts/ole123",
      options
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching API data:", error);
    throw error;
  }
}

const myApiKey = "5794466a-ac21-441f-8a55-385e2fda14c7"; // Define your API key

// Function to update the visibility of edit and delete buttons based on token existence
function updateButtonsVisibility() {
  const token = localStorage.getItem("accessToken");
  const editPostBtn = document.getElementById("edit-post-btn");
  const deletePostBtn = document.getElementById("delete-post-btn");

  if (token) {
    // Token exists, show buttons
    editPostBtn.style.display = "block";
    deletePostBtn.style.display = "block";
  } else {
    // Token does not exist, hide buttons
    editPostBtn.style.display = "none";
    deletePostBtn.style.display = "none";
  }
}
//showpost-----------------------------------------------------------------------------------------
//const response = await fetch(`https://v2.api.noroff.dev/blog/posts/ole123/${postId}`
// Fetches the API data and handles post rendering
function fetchAndRenderPost() {
  const postId = getPostIdFromURL();
  fetchApi(myApiKey, postId)
    .then(renderPost)
    .catch((error) => {
      console.error("Fetch operation failed:", error);
    });
}

// Renders the post based on the response data
function renderPost(response) {
  console.log("Fetched data:", response);
  const postsContainer = document.getElementById("posts");

  if (
    response &&
    response.data &&
    Array.isArray(response.data) &&
    response.data.length > 0
  ) {
    const postId = getPostIdFromURL();
    const matchingPost = response.data.find((post) => post.id === postId);

    if (matchingPost) {
      renderMatchingPost(matchingPost, postsContainer);
    } else {
      renderNoMatchingPost(postsContainer);
    }
  } else {
    renderNoPosts(postsContainer);
  }
}

// Renders the matching post
function renderMatchingPost(post, container) {
    const { updated, tags, id, title, body, media, author, created } = post;
    const postLink = `blog.html?id=${id}`;
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
      <div class="blog-card-big">
        <img src="${media.url}" alt="${media.alt}" class="post-image-big">
        <div class="detail-info-text">
          <p class="tags">${tags}</p>
          <p>${title}</p>
          <p class="body-text">${body}</p>
          <p>Author: ${author.name}</p>
          <p>Created: ${new Date(created).toLocaleString()}</p>
          <p>Updated: ${updated}</p>
          <button class="share-button" data-post-id="${id}"><i class="fas fa-share"></i></button>
        </div>
      </div>
    `;
  
    // Attach event listener to share button
    const shareButton = postElement.querySelector('.share-button');
    shareButton.addEventListener('click', function() {
      const postId = this.getAttribute('data-post-id');
      const shareableURL = window.location.origin + window.location.pathname + `?id=${postId}`;
      navigator.clipboard.writeText(shareableURL)
        .then(() => {
          alert("URL copied: " + shareableURL);
        })
        .catch((error) => {
          console.error("Failed to copy URL: ", error);
        });
    });
  
    container.appendChild(postElement);
}


// Renders a message when no matching post is found
function renderNoMatchingPost(container) {
  container.innerHTML = "<p>No matching post found.</p>";
}

// Renders a message when no posts are found
function renderNoPosts(container) {
  container.innerHTML = "<p>No posts found.</p>";
}

// Function to extract the post ID from the URL
function getPostIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Fetch and render the post when the page loads
fetchAndRenderPost();

//showpost-----------------------------------------------------------------------------------------
// Call updateButtonsVisibility() after DOM content is loaded
document.addEventListener("DOMContentLoaded", updateButtonsVisibility);

//delete an post---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const deletePostBtn = document.getElementById("delete-post-btn");
  deletePostBtn.addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found in local storage");
      }

      // Extract post ID from URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get("id");

      // Call deletePost function with the retrieved post ID
      await deletePost(token, postId);

      // Optional: Redirect or update UI to reflect that the post has been deleted
    } catch (error) {
      console.error("Error deleting post:", error);
      // Optional: Handle errors
    }
  });
});

async function deletePost(token, postId) {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/ole123/${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete post. Status: ${response.status}`);
    }

    console.log("Post deleted successfully");
    // Optionally, redirect or update UI to reflect that the post has been deleted
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

//edit post---------------------------------------------------------------------------

// Get a reference to the button and the element to show/hide
const editButton = document.getElementById("edit-post-btn");
const editForm = document.getElementById("edit-show");

// Function to toggle the visibility of the element
function toggleElementVisibility(element) {
  if (element.style.display === "none" || element.style.display === "") {
    element.style.display = "block"; // Show the element
  } else {
    element.style.display = "none"; // Hide the element
  }
}

// Event listener for the edit button
editButton.addEventListener("click", () => {
  toggleElementVisibility(editForm); // Toggle the visibility of the edit form
});

// Function to update the post on the server
async function updatePost(token, postId, postData) {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/ole123/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to save edited post: ${response.statusText}`);
    }

    console.log("Post edited successfully");
    // Optionally, handle the response or update the UI
  } catch (error) {
    console.error("Error saving edited post:", error);
    // Optionally, handle the error
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve token from local storage
  const token = localStorage.getItem("accessToken");

  // Get the save button element
  const saveEditBtn = document.getElementById("save-edit-btn");

  // Function to toggle the visibility of the save button
  function toggleSaveButtonVisibility() {
    if (token) {
      // Token exists, show the save button
      saveEditBtn.style.display = "block";
    } else {
      // Token does not exist, hide the save button
      saveEditBtn.style.display = "none";
    }
  }

  // Initial toggle of save button visibility
  toggleSaveButtonVisibility();

  // Add event listener for clicking the "Save" button
  saveEditBtn.addEventListener("click", async () => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Access token not found in local storage");
      }

      // Get the updated post data from the form inputs
      const title = document.getElementById("title").value;
      const body = document.getElementById("body").value;
      const tags = document
        .getElementById("tags")
        .value.split(",")
        .map((tag) => tag.trim());
      const mediaUrl = document.getElementById("media-url").value;
      const mediaAlt = document.getElementById("media-alt").value;

      const postData = {
        title,
        body,
        tags,
        media: {
          url: mediaUrl,
          alt: mediaAlt,
        },
      };
      // Get the post ID from the URL
      const postId = getPostIdFromURL();

      // Call the function to send the updated post data
      await updatePost(token, postId, postData);

      // Optionally, update the UI or take other actions after the post is saved
    } catch (error) {
      console.error("Error saving edited post:", error);
      // Handle the error if needed
    }
  });
});
