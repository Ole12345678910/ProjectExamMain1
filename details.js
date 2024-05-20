import { fetchApi, myApiKey } from "./api.js";

// Update the visibility of edit and delete buttons based on token existence
function updateButtonsVisibility() {
  const token = localStorage.getItem("accessToken");
  const editPostBtn = document.getElementById("edit-post-btn");
  const deletePostBtn = document.getElementById("delete-post-btn");

  const displayStyle = token ? "block" : "none";
  editPostBtn.style.display = displayStyle;
  deletePostBtn.style.display = displayStyle;
}

// Fetch and render the post
function fetchAndRenderPost() {
  const postId = getPostIdFromURL();
  fetchApi(myApiKey, postId)
    .then(renderPost)
    .catch((error) => console.error("Fetch operation failed:", error));
}

// Render the post based on the response data
function renderPost(response) {
  const postsContainer = document.getElementById("posts");
  const postId = getPostIdFromURL();

  if (response && response.data && Array.isArray(response.data)) {
    const matchingPost = response.data.find((post) => post.id === postId);
    matchingPost
      ? renderMatchingPost(matchingPost, postsContainer)
      : renderNoMatchingPost(postsContainer);
  } else {
    renderNoPosts(postsContainer);
  }
}

// Render the matching post
function renderMatchingPost(post, container) {
  const { updated, tags, id, title, body, media, author, created } = post;
  const postElement = document.createElement("div");
  postElement.classList.add("post-detail");
  postElement.innerHTML = `
    <img src="${media.url}" alt="${media.alt}" class="post-image-big">
    <div class="detail-info-text">
      <div class="container-holder">
        <div class="tags-main-box">
          <p class="tags-main">${tags}</p>
        </div>
        <p class="detail-text1">Created: ${new Date(
          created
        ).toLocaleString()}</p>
        <p class="detail-text2">Updated: ${updated}</p>
      </div>
      <p class="detail-text3">${title}</p>
      <p class="detail-text4">${body}</p>
      <div class="author-box">
        <img class="img-box2" src="assest/cute-hedgehog-looking-camera-small-fluffy-generated-by-artificial-intelligence.jpg" alt="image of a hedgehog"/>
        <p class="detail-text5">Author: ${author.name}</p>
      </div>
      <button class="share-button" data-post-id="${id}">
        <i class="fas fa-share"></i>
      </button>
    </div>
  `;

  postElement
    .querySelector(".share-button")
    .addEventListener("click", function () {
      const postId = this.getAttribute("data-post-id");
      const shareableURL = `${window.location.origin}${window.location.pathname}?id=${postId}`;
      navigator.clipboard
        .writeText(shareableURL)
        .then(() => alert(`URL copied: ${shareableURL}`))
        .catch((error) => console.error("Failed to copy URL:", error));
    });

  container.appendChild(postElement);
}

// Render a message when no matching post is found
function renderNoMatchingPost(container) {
  container.innerHTML = "<p>No matching post found.</p>";
}

// Render a message when no posts are found
function renderNoPosts(container) {
  container.innerHTML = "<p>No posts found.</p>";
}

// Extract the post ID from the URL
function getPostIdFromURL() {
  return new URLSearchParams(window.location.search).get("id");
}

// Delete a post
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

    alert("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

// Update the post on the server
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

    alert("Post edited successfully");
  } catch (error) {
    console.error("Error saving edited post:", error);
  }
}

// Toggle element visibility
function toggleElementVisibility(element) {
  element.style.display =
    element.style.display === "none" || element.style.display === ""
      ? "block"
      : "none";
}

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  updateButtonsVisibility();
  fetchAndRenderPost();

  const deletePostBtn = document.getElementById("delete-post-btn");
  deletePostBtn.addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found in local storage");
      const postId = getPostIdFromURL();
      await deletePost(token, postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  });

  const editButton = document.getElementById("edit-post-btn");
  const editForm = document.getElementById("edit-show");
  editButton.addEventListener("click", () => toggleElementVisibility(editForm));

  const saveEditBtn = document.getElementById("save-edit-btn");
  saveEditBtn.style.display = localStorage.getItem("accessToken")
    ? "block"
    : "none";
  saveEditBtn.addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Access token not found in local storage");

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
        media: { url: mediaUrl, alt: mediaAlt },
      };
      const postId = getPostIdFromURL();
      await updatePost(token, postId, postData);
    } catch (error) {
      console.error("Error saving edited post:", error);
    }
  });
});


// Function to toggle between login and logout
function toggleLoginLogout() {
    const accessToken = localStorage.getItem("accessToken");
  
    if (accessToken) {
      // If logged in, perform logout actions
      localStorage.clear(); // Clear local storage
      window.location.href = "/index.html"; // Redirect to index page
    } else {
      // If not logged in, redirect to the login page
      window.location.href = "/login.html";
    }
  }
  
  // Function to check if the user is logged in
  function checkLoginStatus() {
    const accessToken = localStorage.getItem("accessToken");
    const loginButton = document.getElementById("login-logout-btn");
  
    if (accessToken) {
      // If logged in, change button text to "Logout" and add event listener
      loginButton.textContent = "Logout";
      loginButton.addEventListener("click", toggleLoginLogout);
    } else {
      // If not logged in, keep button text as "Login" and add event listener
      loginButton.textContent = "Login";
      loginButton.addEventListener("click", () => {
        window.location.href = "/login.html";
      });
    }
  }
  
  // Call checkLoginStatus function when the page loads
  document.addEventListener("DOMContentLoaded", checkLoginStatus);
  