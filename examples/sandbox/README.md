# Search UI Examples Sandbox

This repository contains multiple interactive examples demonstrating how to integrate and customize Search UI with various Elasticsearch-based APIs.

## Getting Started

### Install Dependencies

```bash
yarn install
```

### Start Sandbox

To run the sandbox example with frontend:

```bash
yarn dev
```

To run an example with a Node.js server proxy (production-ready example):

```bash
yarn dev:server
```

The application runs by default on `http://localhost:5173`, and the server (if applicable) runs on `http://localhost:3001`.

## Project Structure

- `src/pages`: Contains multiple examples showcasing different connectors and use cases.
  - `elasticsearch-basic`: Simple example using Elasticsearch Connector directly from the browser (basic usage).
  - `elasticsearch-production-ready`: Recommended production-ready setup with Node.js proxy for secure usage.
    - Includes a Node.js server example (`server/index.js`).
  - Other examples covering features like autocomplete, custom styling, analytics, etc.

## Available Examples

- **Elasticsearch Connector (Basic, Browser-only)**: A simple, lightweight example directly querying Elasticsearch from the browser.
- **Elasticsearch Connector (Production-ready, Proxy connector)**: Recommended setup with a Node.js server acting as a secure proxy.
- **Elastic Site Search**

Additional customization examples include:

- Search-as-you-type
- Customizing styles and HTML
- Search bar integration
- Elasticsearch analytics integration
- **Ecommerce**

Explore specialized use cases such as ecommerce in provided examples.

## Adding New Examples

To add a new example, create a new directory inside `src/pages` and structure your example similarly to the existing ones. Update the home page (`src/pages/home.tsx`) and routers(`src/Routers.tsx`) to include your example.

## Contributing

Feel free to contribute new examples or improvements by opening a pull request.

---
