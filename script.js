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

const BlogName = localStorage.getItem("name");

// Function to show buttons based on certain conditions (e.g., after login)
function showButton() {
  // Check if user is logged in (example: check if access token exists in localStorage)
  const accessToken = localStorage.getItem("accessToken");
  const BlogName = localStorage.getItem("name");

  if (accessToken) {
    // User is logged in, show the buttons
    document.getElementById("show-button").style.display = "inline-block";
    document.getElementById("blogName").innerHTML = "Welcome " + BlogName;
  } else {
    // User is not logged in, buttons remain hidden (display: none;)
    // Optionally, you can choose to do something else here (e.g., redirect to login page)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const showButton = document.getElementById("show-button");
  const createShow = document.getElementById("create-show");

  showButton.addEventListener("click", () => {
    // Toggle the visibility of the create-show element
    createShow.style.display =
      createShow.style.display === "none" ? "block" : "none";
  });
});

// Call the showButtons function when the page loads
showButton();

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
    console.log("Post created successfully:", responseData);
    return responseData; // Return the created post data if needed
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

function getTokenFromLocalStorage() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found in local storage");
  }
  return token;
}

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

const myApiKey = "5794466a-ac21-441f-8a55-385e2fda14c7"; // Define your API key

// Fetch data for the first set of posts and create carousel
fetchApi(myApiKey)
  .then((response) => {
    console.log("Fetched data:", response);
    const topPostsContainer = document.getElementById("top-posts");

    // Check if response contains data
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
  // Check if response contains data
  if (postsData && Array.isArray(postsData) && postsData.length > 0) {
    // Sort posts by the 'created' tag (assuming 'created' is a date)
    postsData.sort((a, b) => new Date(b.created) - new Date(a.created));

    // Extract only the top 3 newest posts
    const top3Posts = postsData.slice(0, 3);

    // Iterate through each post object
    top3Posts.forEach((post) => {
      const tags = post.tags;
      const title = post.title;
      const media = post.media.url;
      const postId = post.id || ``;

      // Create HTML elements for each post
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
                <p class="tags-main">${tags}</p>
            </div>
            <p class="title-text">${title}</p>
          </div>
        `;
      postElement.addEventListener("click", () => {
        window.location.href = `/details.html?id=${postId}`;
      });
      // Append the post element to the container
      container.appendChild(postElement);
    });
  } else {
    // Display a message if no data is received
    container.innerHTML = "<p>No posts found.</p>";
  }
}

// Function to create the second set of posts
function createSecondPosts(postsData, container) {
  // Implement this function similarly to createCarousel, but with different logic if needed
}

function initializeCarousel() {
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");
  const carouselWrapper = document.querySelector(".carousel-wrapper");
  const postContainer = document.querySelector(".blog-container");
  const postCards = document.querySelectorAll(".post");
  let currentIndex = 0;
  const cardWidth =
    postCards[0].offsetWidth +
    parseInt(getComputedStyle(postCards[0]).marginRight);

  const moveAmount = 1; // Adjust this value as needed

  nextButton.addEventListener("click", function () {
    currentIndex += moveAmount * cardWidth; // Increment by moveAmount * cardWidth
    if (currentIndex >= postCards.length * cardWidth) {
      // Check if currentIndex exceeds total width
      currentIndex = 0; // Reset currentIndex to start
    }
    updateCarousel();
  });

  prevButton.addEventListener("click", function () {
    currentIndex -= moveAmount * cardWidth; // Decrement by moveAmount * cardWidth
    if (currentIndex < 0) {
      currentIndex = postCards.length * cardWidth - cardWidth; // Set currentIndex to the end
    }
    updateCarousel();
  });

  function updateCarousel() {
    postCards.forEach((card, index) => {
      card.style.transform = `translateX(-${currentIndex}px)`;
    });
  }
}

/*other posts*/

const clearStorage = document.getElementById("clearStorage");

clearStorage.addEventListener("click", () => {
  localStorage.clear();
});

fetchApi(myApiKey)
  .then((response) => {
    console.log("Fetched data:", response);
    const postsContainer = document.getElementById("posts");

    // Check if response contains data
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

        // Create HTML elements for each post
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <div class="blog-card-main">
              <img src="${media}" alt="${media.alt}" class="post-image-big">
              <p class="tags">${tags}</p>
              <h2>${title}</h2>
            </div>
          `;

        // Add event listener to redirect to details page on click
        postElement.addEventListener("click", () => {
          window.location.href = `/details.html?id=${postId}`;
        });

        // Append the post element to the posts container
        postsContainer.appendChild(postElement);
      });
    } else {
      // Display a message if no data is received
      postsContainer.innerHTML = "<p>No posts found.</p>";
    }
  })
  .catch((error) => {
    console.error("Fetch operation failed:", error);
  });
