# SnippetStash

## Overview
SnippetStash is a web application that allows users to create, manage, and share code or note snippets efficiently. With features like search, edit, delete, share, and copy to clipboard, SnippetStash makes organizing and retrieving snippets seamless.

## Features
- **Create Snippets**: Easily add new code or note snippets.
- **Search Snippets**: Quickly find snippets based on their title.
- **Edit Snippets**: Modify existing snippets as needed.
- **Delete Snippets**: Remove unwanted snippets.
- **Share Snippets**: Share your snippets with others.
- **Copy to Clipboard**: Copy snippet content with a single click.

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Database**: Local Storage
  
## Installation

### Prerequisites
Make sure you have the following installed:
- Node.js & npm
- React.js
- Tailwind
- React Router Dom

### Steps
1. Clone the repository:
   ```sh
   https://github.com/hrsh-1294/SnippetStash.git
   cd SnippetStash
   ```
2. Install dependencies:
   ```sh
   npm install tailwindcss @tailwindcss/vite
   ```
   ```sh
   npm install
   ```
   ```sh
   npm i react-router-dom
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```


## API Endpoints
| Method | Endpoint           | Description             |
|--------|-------------------|-------------------------|
| GET    | `/`               | Get home page          |
| GET    | `/snippets`       | Get all snippets       |
| POST   | `/snippets`       | Create a new snippet   |
| GET    | `/snippets/:id`   | Get a specific snippet |
| PUT    | `/snippets/:id`   | Update a snippet      |
| DELETE | `/snippets/:id`   | Delete a snippet      |

## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.
