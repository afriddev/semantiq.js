# semantiq.js

🚀 **semantiq.js** is a lightweight, browser-native semantic search engine powered by JavaScript and vector embeddings. It enables fast, offline search by meaning — not just keywords — entirely in the client, using WebAssembly and vector databases like PGlite.

### 🔍 Features

- Semantic search with vector similarity (L2 distance)
- Runs 100% in the browser (no backend/server)
- Embedding storage using SQLite (via PGlite + WebAssembly)
- Easy to insert, search, and index data
- Perfect for AI assistants, knowledge bases, or note-taking apps

### 🛠 Tech Stack

- **JavaScript** / TypeScript
- **PGlite** for in-browser SQLite
- **Transformer.js** for text embeddings (or custom model)
- **WebAssembly (WASM)** for fast local database operations

### 💡 Use Cases

- AI-enhanced in-browser search tools
- Offline semantic search for web apps
- Personal knowledge management
- Lightweight local AI agents

### 📦 Example

```js
await insertEmbedding(db, "The sun is bright", [/* vector */]);
const results = await doVectorSearch(db, [/* query vector */]);
