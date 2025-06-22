# Novel Reader AI – Frontend

Welcome! This is the frontend for Novel Reader AI, a web app that lets you upload, read, annotate, and share novels, with some AI-powered features for fun. The app is built with React and Vite, and uses Redux Toolkit for state management.

## What You Can Do
- Register, log in, and manage your profile
- Upload EPUB or TXT novels and read them page by page
- Highlight text, add notes, and (soon) more annotation types
- Generate images for passages using AI (Cloudflare Workers)
- Bookmark pages, add notes, and track your reading progress
- Share passages or your reading progress with friends
- View reading stats (time, completion, etc.)
- Switch between light, dark, and sepia themes, or enable dyslexia-friendly mode

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

The app runs on [Vite](https://vitejs.dev/) (default: http://localhost:5173). Make sure the backend is running for full functionality.

## Main Tech Stack
- **React 19**
- **Redux Toolkit** for state management
- **React Router v7** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Chart.js** for stats/visualizations

## Folder Structure
- `src/components/` – UI components (Reader, Navbar, Bookmarks, etc.)
- `src/features/` – Redux slices (auth, novels, annotations, etc.)
- `src/pages/` – Main app pages (Home, Reader, Profile, etc.)
- `src/services/api.js` – All API calls are centralized here
- `src/styles/` – Custom CSS (themes, scrollbars)

## How State & API Calls Work
- State is managed with Redux Toolkit slices in `src/features/`.
- API calls are made with Axios, mostly via `src/services/api.js`.
- Async actions (thunks) handle fetching/saving data to the backend.
- Most user actions (login, upload, annotate, etc.) update both local state and backend.

## Notes & To-Do
- Reading streaks are not implemented yet ("Coming soon" in stats)
- Annotation categories are planned but not in the UI yet
- Auto page turning and scroll-to-page are commented out in the Reader
- No automated tests yet – please test manually before deploying

---
If you're picking this up, feel free to reach out or leave comments. And please update this README if you add new features or change things!
