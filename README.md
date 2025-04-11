# GitHub User Activity CLI By Ahmed Hesham

A command line tool to fetch and display a GitHub user's recent activity.

## Requirements

- Node.js installed
- GitHub username to query

## Installation

1. Clone this repository
2. Run `npm install` (if applicable)

## Usage

```bash
node github-activity.js <username>
```

Example:
```bash
node github-activity.js AhmedHeshamC
```

## Output Example

- Pushed 1 commits to AhmedHeshamC/taskTracker
- Performed CreateEvent on AhmedHeshamC/taskTracker
- Performed CreateEvent on AhmedHeshamC/taskTracker

## API

The tool uses GitHub's public API endpoint:
`https://api.github.com/users/<username>/events`

## Error Handling

The tool will display appropriate error messages for:
- Invalid usernames
- API failures
- Network issues

## License

MIT

## Project URLs
https://roadmap.sh/projects/github-user-activity