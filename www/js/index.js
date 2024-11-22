const API_KEY = '$2a$10$CuTwPfw9DnQYSZYOaT0Xx.9Ky7TCZk2XfxMbl9S4Xm0m97p87nn2a';
const BIN_ID = '67403a6ae41b4d34e458789c';

document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('post-form');
  const postList = document.getElementById('post-list');
  const url = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  const fetchPosts = () => {
    fetch(`${url}/latest`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        console.log('Error getting posts');
      }
    })
    .then(data => {
      const reverseBlogPost = data.record.blog.reverse();
      reverseBlogPost.forEach(post => {
				const postElement = document.createElement('div');
				postElement.classList.add('post');
				postElement.innerHTML = `
					<h3>${post.title}</h3>
					<p>${post.content}</p>
					<p class='author'>${post.author}</p>
					`;
				postList.appendChild(postElement);
			});
		})
	};

  fetchPosts();

  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const newPost = { id: uuid.v4(), title, content }

    fetch(`${url}/latest`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
    })
    .then(res => res.json())
    .then(data => {
      const updatedBlogPosts = [...data.record.blog, newPost];

      return fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master_key': API_KEY
        },
        body: JSON.stringify({ blog: updatedBlogPosts })
      })
    })
    .then(res => res.json())
    .then(data => {
      fetchPosts();
      postForm.reset();
    })
  })
});
