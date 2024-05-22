// Base URL for the API
export const API_BASE_URL = "https://v2.api.noroff.dev/";

// Define your API key
export const myApiKey = "5794466a-ac21-441f-8a55-385e2fda14c7";

// Define and export the fetchApi function
export async function fetchApi(apiKey) {
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
  