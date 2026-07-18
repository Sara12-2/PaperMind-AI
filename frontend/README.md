# PaperMind AI — Frontend

RAG-powered research paper Q&A interface built with React.js.

## Setup

```bash
npm install
npm start
```

Make sure your Flask backend is running on `http://localhost:5000`.

## Environment Variables

Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
```

For production, change this to your Render backend URL.

## Project Structure

```
src/
├── components/     UI components
├── hooks/          Logic (state, API calls)
├── services/       api.js — all fetch() calls
├── styles/         global.css
├── App.jsx         Root layout
└── index.js        Entry point
```

## Backend API Expected

| Endpoint     | Method | Body                          | Response                        |
|-------------|--------|-------------------------------|---------------------------------|
| `/upload`   | POST   | FormData `file`               | `{ doc_id, message }`           |
| `/ask`      | POST   | `{ question, doc_id }`        | `{ answer, sources: [{text, page}] }` |
