# Pinterest Clone

This project aims to be a fully functional clone of Pinterest, designed to replicate the core features of the popular image-sharing platform. Users can create accounts, upload images, organize them into collections, and explore content shared by other users. The project is built using modern web technologies for an intuitive and responsive user experience.

## Features (till now)

- **User Authentication**: Users can sign up, log in, and manage their profiles.
- **Image Upload & Sharing**: Users can upload images, which are displayed in a Pinterest-style grid.
- **Saved Posts**: Users can save posts (images) to their own profiles.
- **Like Posts**: Users can like posts to show appreciation for the content.
- **Profile Pages**: Users can view their own and others' profile pages, including their saved posts.
- **Google Auth (Not Working Right Now)** - Users can sign up/login with Google account.
- **Comments (Still need final touches)** - Users can comment on posts.

## Technologies Used

- **Frontend (Made using bolt.new)**: 
  - HTML5
  - CSS3
  - Vanilla JavaScript
- **Backend**: 
  - Node.js
  - Express.js
  - MongoDB (Mongoose for database management)
- **Image Storage**: Currently on Local Machine
- **Authentication**: Passport
- **Deployment**: Heroku / Vercel (optional)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16+)
- MongoDB Community Server (MongoDBCompass not necessary)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sayantann7/pinterest-clone.git
   cd pinterest-clone
   ```

2. **Install Dependencies**:
   ```bash
   npm i
   ```

3. **Run the Development Server**:
   In the root directory, run:
   ```bash
   npx nodemon
   ```

6. **Visit the App**:
   Open your browser and go to `http://localhost:3000` to view the app.
