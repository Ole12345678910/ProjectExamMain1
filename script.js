import { fetchApi, myApiKey, API_BASE_URL } from "./api.js";

// Function to show buttons based on certain conditions (e.g., after login)
function showButton() {
  const accessToken = localStorage.getItem("accessToken");
  const BlogName = localStorage.getItem("name");

  if (accessToken) {
    document.getElementById("show-button").style.display = "inline-block";
    document.getElementById("blogName").innerHTML = "Welcome " + BlogName;
  } else {
    // Optionally, you can choose to do something else here (e.g., redirect to login page)
  }
}

// Event listener for button click to toggle visibility of create post section
document.addEventListener("DOMContentLoaded", () => {
  const showButton = document.getElementById("show-button");
  const createShow = document.getElementById("create-show");

  showButton.addEventListener("click", () => {
    createShow.style.display =
      createShow.style.display === "none" ? "block" : "none";
  });
});

// Call the showButton function when the page loads
showButton();

// Function to create a new post
async function createPost(token, postData) {
  try {
    const response = await fetch(`${API_BASE_URL}blog/posts/ole123`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create post. Status: ${response.status}`);
    }

    const responseData = await response.json();
    alert("Post created successfully:", responseData);
    return responseData; // Return the created post data if needed
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// Function to retrieve access token from local storage
function getTokenFromLocalStorage() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found in local storage");
  }
  return token;
}

// Event listener for create post button click to handle post creation
document.addEventListener("DOMContentLoaded", () => {
  const createPostBtn = document.getElementById("create-post-btn");

  createPostBtn.addEventListener("click", async () => {
    try {
      const token = getTokenFromLocalStorage();
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

      await createPost(token, postData);
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  });
});

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

// Function to initialize carousel
function initializeCarousel() {
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");
  const postCards = document.querySelectorAll(".post");
  let currentIndex = 0;
  let cardWidth =
    postCards[0].offsetWidth +
    parseInt(getComputedStyle(postCards[0]).marginRight);

  const moveAmount = 1;

  function updateCarousel() {
    postCards.forEach((card, index) => {
      card.style.transform = `translateX(-${currentIndex}px)`;
    });
  }

  function moveNext() {
    currentIndex += moveAmount * cardWidth;
    if (currentIndex >= postCards.length * cardWidth) {
      currentIndex = 0;
    }
    updateCarousel();
  }

  function movePrev() {
    currentIndex -= moveAmount * cardWidth;
    if (currentIndex < 0) {
      currentIndex = postCards.length * cardWidth - cardWidth;
    }
    updateCarousel();
  }

  nextButton.addEventListener("click", moveNext);
  prevButton.addEventListener("click", movePrev);

  setInterval(moveNext, 4000); // Auto-scroll every 4 seconds

  // Resize event listener
  window.addEventListener("resize", () => {
    cardWidth =
      postCards[0].offsetWidth +
      parseInt(getComputedStyle(postCards[0]).marginRight);
    currentIndex = currentIndex % (postCards.length * cardWidth);
    updateCarousel();
  });
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
