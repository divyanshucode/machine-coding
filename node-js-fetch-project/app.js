const https = require('https');

async function fetchData() {
  const postsUrl = 'https://jsonplaceholder.typicode.com/posts';

  try {
    // Fetch posts
    const postsData = await new Promise((resolve, reject) => {
      https.get(postsUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const user1Posts = postsData.filter(post => post.userId === 1);

    console.log('Posts by User 1:');
    user1Posts.forEach(post => console.log(`- ${post.title}`));

    // Fetch comments for each post
    const commentPromises = user1Posts.map(post => {
      return new Promise((resolve, reject) => {
        https.get(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });
    });

    const allComments = await Promise.all(commentPromises);

    const totalComments = allComments.reduce((sum, comments) => sum + comments.length, 0);

    console.log(`\nTotal comments for these posts: ${totalComments}`);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

fetchData();