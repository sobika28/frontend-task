
const postsContainer = document.getElementById("posts-container");
const statusText = document.getElementById("status");
const refreshButton = document.getElementById("refresh-btn");

async function loadPosts() {
    refreshButton.disabled = true;
    statusText.textContent = "Loading posts...";
    postsContainer.replaceChildren();

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?_limit=12"
        );

        if (!response.ok) {
            throw new Error("Unable to fetch posts.");
        }

        const posts = await response.json();

        if (posts.length === 0) {
            statusText.textContent = "No posts found.";
            return;
        }

        const postCards = posts.map(post => {
            const article = document.createElement("article");
            article.className = "post-card";

            const postId = document.createElement("span");
            postId.className = "post-id";
            postId.textContent = `Post #${post.id}`;

            const title = document.createElement("h2");
            title.textContent = post.title;

            const body = document.createElement("p");
            body.textContent = post.body;

            article.append(postId, title, body);

            return article;
        });

        postsContainer.replaceChildren(...postCards);

        statusText.textContent =
            `Successfully loaded ${posts.length} posts.`;

    } catch (error) {
        statusText.textContent =
            `Error: ${error.message}. Please try again.`;

    } finally {
        refreshButton.disabled = false;
    }
}

refreshButton.addEventListener("click", loadPosts);

loadPosts();
