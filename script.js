const myApiKey = "5794466a-ac21-441f-8a55-385e2fda14c7"; // Define your API key
// Export the function
// Export the function
export { toggleNavbar };

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

const API_BASE_URL = "https://v2.api.noroff.dev/";

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

// Event listener for button click
document.addEventListener("DOMContentLoaded", () => {
  const showButton = document.getElementById("show-button");
  const createShow = document.getElementById("create-show");

  showButton.addEventListener("click", () => {
    createShow.style.display =
      createShow.style.display === "none" ? "block" : "none";
  });
});

// Call the showButtons function when the page loads
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

// Event listener for create post button click
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
      alert("Failed to create post. Please try again.");
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
          <div class="blog-card">
            <div class="image-container">
                <div class="gradient-overlay"></div>
                <img src="${media}" alt="${media.alt}" class="post-image">
                <div class="text-box">
                    <p class="read-more">Read more</p>
                </div>
            </div>
            <div class="tags-box">
                <p class="tags">${tags}</p>
            </div>
            <p class="title-text">${title}</p>
          </div>
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
  const carouselWrapper = document.querySelector(".carousel-wrapper");
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

  setInterval(moveNext, 4000000); // Auto-scroll every 4 seconds

  // Resize event listener
  window.addEventListener("resize", () => {
    cardWidth =
      postCards[0].offsetWidth +
      parseInt(getComputedStyle(postCards[0]).marginRight);
    currentIndex = currentIndex % (postCards.length * cardWidth);
    updateCarousel();
  });
}

// Clear local storage
const clearStorage = document.getElementById("clearStorage");

clearStorage.addEventListener("click", () => {
  localStorage.clear();
});

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
              <img src="${media}" alt="${media.alt}" class="post-image-main">
              <div class="info-box">
                <p class="title-main">${title}</p>
                <p class="read-more-main">Read more</p>
                <div class="tags-main-box">
                  <p class="tags-main">${tags}</p>
                </div>
              </div>
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

// Function to toggle the navbar
function toggleNavbar() {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navbar = document.querySelector('.navbar');

  hamburgerMenu.addEventListener('click', function() {
    navbar.classList.toggle('active');
  });
}
