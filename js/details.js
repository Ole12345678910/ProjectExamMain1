import { fetchApi, myApiKey } from "./api.js";
import {
  toggleLoginLogout,
  checkLoginStatus,
  deletePost,
  updatePost,
} from "./utility.js";

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
      <section class="container-holder">
        <div class="tags-main-box">
          <p class="tags-main">${tags}</p>
        </div>
        <p class="detail-text1">Created: ${new Date(
          created
        ).toLocaleString()}</p>
        <p class="detail-text2">Updated: ${updated}</p>
      </section>
      <p class="detail-text3">${title}</p>
      <p class="detail-text4">${body}</p>
      <aside class="author-box">
        <img class="img-box2" src="assest/cute-hedgehog-looking-camera-small-fluffy-generated-by-artificial-intelligence.jpg" alt="image of a hedgehog"/>
        <p class="detail-text5">Author: ${author.name}</p>
      </aside>
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
      // Ask for confirmation
      const confirmed = confirm("Are you sure you want to delete this post?");
      if (!confirmed) return; // If not confirmed, return without deleting

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found in local storage");
      const postId = getPostIdFromURL();
      await deletePost(token, postId);

      // Refresh the page after successful deletion
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  });
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

    // Refresh the page after successfully saving the edit
    window.location.reload();
  } catch (error) {
    console.error("Error saving edited post:", error);
  }
});

// Call checkLoginStatus function when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);

// Use toggleLoginLogout function when a logout button is clicked
const logoutButton = document.getElementById("login-logout-btn");
logoutButton.addEventListener("click", toggleLoginLogout);
