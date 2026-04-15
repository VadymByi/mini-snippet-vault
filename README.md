Mini Snippet Vault
A full-stack service for saving and managing useful information fragments like code commands, notes, and links. Built as a technical assignment for a Junior FullStack Developer position.

Tech Stack
Frontend: Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query, Axios, Zod, React Hook Form.
Backend: NestJS, TypeScript, MongoDB, Mongoose, Class-validator.
Database: MongoDB with Text Indexing for search.

Local Setup
Prerequisites
You will need Node.js (v18+) and a running MongoDB instance.

Backend Setup
Navigate to the backend folder: cd backend

Install dependencies: npm install

Create a .env file based on .env.example.

Set PORT=3001 and your MONGODB_URI.

Start in development mode: npm run start:dev

Frontend Setup
Navigate to the frontend folder: cd frontend

Install dependencies: npm install

Create a .env.local file based on .env.example.

Set NEXT_PUBLIC_API_URL=http://localhost:3001

Start in development mode: npm run dev

The application will be available at http://localhost:3000.

API Endpoints
GET /snippets — Get all snippets (Supports query params: q for search, tag for filtering, page/limit for pagination).
GET /snippets/:id — Get a single snippet by ID.
POST /snippets — Create a new snippet.
PATCH /snippets/:id — Update an existing snippet.
DELETE /snippets/:id — Remove a snippet.

Production Build
To build the project for production, run "npm run build" in both the backend and frontend folders, then use "npm run start" to launch.

Features Implemented
Backend: Full CRUD functionality, DTO validation, MongoDB text index for title and content search, and built-in pagination logic.
Frontend: Snippet creation form with Zod validation, real-time search with 500ms debounce to optimize API calls, loading and error states, and responsive UI.
Type Safety: Shared interfaces and strict TypeScript usage throughout the project to prevent runtime errors.

What’s Next (Future Improvements)
Due time constraint, some features were intentionally left out. Here is how I would enhance the service:

Pagination UI: While the backend fully supports pagination (page/limit), the frontend currently displays only the first page. I would add a "Load More" button or a classic pagination component to handle large datasets.

Form Persistence: To improve UX, I would implement localStorage caching for the creation form. This prevents data loss if a user accidentally refreshes the page while typing a long snippet.

Advanced Search: I would transition from Regex-based search to MongoDB Text Search or Atlas Search for better performance and support for fuzzy matching/partial word search.

Enhanced Tag Filtering: Currently, tags are filtered via a general search query. I would implement a dedicated tag-selection system on the frontend for more precise results.
