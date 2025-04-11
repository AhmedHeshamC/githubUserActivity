#!/usr/bin/env node

// Get command line arguments
const args = process.argv.slice(2);

// Check if username is provided
if (args.length === 0) {
  console.error('Please provide a GitHub username');
  console.log('Usage: github-activity <username>');
  process.exit(1);
}

// Validate username input
const username = args[0];
if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username)) {
  console.error('Error: Invalid GitHub username format');
  process.exit(1);
}

// Set up API request with authentication and rate limiting headers
const apiUrl = `https://api.github.com/users/${username}/events?per_page=10`;
const headers = {
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'GitHub-Activity-CLI'
};

// Fetch user activity from GitHub API with secure headers
fetch(apiUrl, { headers })
  .then(response => {
    // Check rate limit headers
    const rateLimit = response.headers.get('x-ratelimit-remaining');
    if (rateLimit && parseInt(rateLimit) < 10) {
      console.warn(`Warning: Only ${rateLimit} API requests remaining in this rate limit window`);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(events => {
    if (!events || events.length === 0) {
      console.log(`No recent activity found for ${username}`);
      return;
    }

    // Process and display events
    events.forEach(event => {
      switch (event.type) {
        case 'PushEvent':
          console.log(`- Pushed ${event.payload.commits.length} commits to ${event.repo.name}`);
          break;
        case 'IssuesEvent':
          console.log(`- ${event.payload.action} issue #${event.payload.issue.number} in ${event.repo.name}`);
          break;
        case 'WatchEvent':
          console.log(`- Starred ${event.repo.name}`);
          break;
        // Add more event types as needed
        default:
          console.log(`- Performed ${event.type} on ${event.repo.name}`);
      }
    });
  })
  .catch(error => {
    if (error.response && error.response.status === 403) {
      console.error('Error: API rate limit exceeded. Try again later.');
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  });