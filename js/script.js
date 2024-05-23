import { fetchApi, myApiKey } from "./api.js";
import {
  toggleLoginLogout,
  checkLoginStatus,
  initializeCarousel,
  handleCreatePostButtonClick,
} from "./utility.js";

function showButton() {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    document.getElementById("show-button").style.display = "inline-block";
  }
}

showButton();

// Event listener for button click to toggle visibility of create post section
document.addEventListener("DOMContentLoaded", () => {
  const showButton = document.getElementById("show-button");
  const createShow = document.getElementById("create-show");

  showButton.addEventListener("click", () => {
    createShow.style.display =
      createShow.style.display === "none" ? "block" : "none";
  });
});

handleCreatePostButtonClick();

// Fetch data for the first set of posts and create carousel
fetchApi(myApiKey)
  .then((response) => {
    const topPostsContainer = document.getElementById("top-posts");

    if (response && response.data) {
      createCarousel(response.data, topPostsContainer);
      initializeCarousel();
    } else {
      console.error("No data received from API");
    }
  })
  .catch((error) => {
    console.error("Fetch operation failed:", error);
  });

// Function to create carousel from fetched data
function createCarousel(postsData, container) {
  if (postsData && Array.isArray(postsData) && postsData.length > 0) {
    postsData.sort((a, b) => new Date(b.created) - new Date(a.created));
    const top3Posts = postsData.slice(0, 3);

    top3Posts.forEach((post) => {
      const tags = post.tags;
      const title = post.title;
      const media = post.media.url;
      const postId = post.id || ``;

      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `
          <article class="blog-card">
          <figure class="image-container">
            <div class="gradient-overlay"></div>
            <img src="${media}" alt="${media.alt}" class="post-image">
            <figcaption class="text-box">
              <p class="read-more">Read more</p>
            </figcaption>
          </figure>
          <section class="tags-box">
            <p class="tags">${tags}</p>
          </section>
          <p class="title-text">${title}</p>
        </article>
        `;
      postElement.addEventListener("click", () => {
        window.location.href = `/details.html?id=${postId}`;
      });
      container.appendChild(postElement);
    });
  } else {
    container.innerHTML = "<p>No posts found.</p>";
  }
}

// Fetch and display other posts
fetchApi(myApiKey)
  .then((response) => {
    const postsContainer = document.getElementById("posts");

    if (
      response &&
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      response.data.forEach((post) => {
        const postId = post.id;
        const tags = post.tags;
        const title = post.title;
        const media = post.media.url;

        const postElement = document.createElement("div");
        postElement.classList.add("post-main");
        postElement.innerHTML = `
              <figure class="post-image-main-container">
              <img src="${media}" alt="${media.alt}" class="post-image-main">
              <figcaption class="info-box">
                <h2 class="title-main">${title}</h2>
                <p class="read-more-main">Read more</p>
                <section class="tags-main-box">
                  <p class="tags-main">${tags}</p>
                </section>
              </figcaption>
            </figure>      
          `;

        postElement.addEventListener("click", () => {
          window.location.href = `/details.html?id=${postId}`;
        });

        postsContainer.appendChild(postElement);
      });
    } else {
      postsContainer.innerHTML = "<p>No posts found.</p>";
    }
  })
  .catch((error) => {
    console.error("Fetch operation failed:", error);
  });

// Call checkLoginStatus function when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);

// Use toggleLoginLogout function when a logout button is clicked
const logoutButton = document.getElementById("login-logout-btn");
logoutButton.addEventListener("click", toggleLoginLogout);
