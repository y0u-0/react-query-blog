# React Query Blog Example

A comprehensive guide and example project demonstrating the power and best practices of TanStack Query (formerly React Query) for managing server state in React applications.

📝 Read the complete blog here: [React Query is all you need](https://medium.com/@you_0/react-query-is-all-you-need-25af68f44d4f)

🔗 [Live Demo](https://react-query-blog-psi.vercel.app)

## Overview

This project serves as a practical demonstration of React Query's capabilities, showcasing how it simplifies server state management in React applications. It includes examples of:

- Basic CRUD operations with React Query
- Advanced caching strategies
- Integration with Zustand for client state
- Factory-style query options
- Custom hooks organization
- Persistence with IndexedDB
- TypeScript integration
- Supabase backend integration

## Features

- 🔄 Efficient server state management
- 🎯 Centralized query/mutation configurations
- 📁 Organized project structure
- 🔍 Type-safe queries and mutations
- 💾 Persistent cache with IndexedDB
- 🔐 Supabase integration for backend
- ⚡ Vite for fast development

## Project Structure

```
services/
└── users/
    ├── hooks.ts      # Custom React Query hooks
    ├── index.ts      # Re-exports
    ├── options.ts    # Factory-style query options
    ├── requests.ts   # API calls
    └── types.ts      # TypeScript definitions
```

## Getting Started

1. Clone the repository:
 ```bash
   git clone https://github.com/y0u-0/react-query-blog
   cd react-query-blog
 ```

2. Install dependencies:
 ```bash
   pnpm install
 ```

3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
 ```bash
   VITE_SUPABASE_URL="your-supabase-url"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
  ```

4. Start the development server:
```bash
   pnpm run dev
```

5. Open your browser and navigate to `http://localhost:5173` to see the application in action.


