import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { createIDBPersister, createQueryClient } from "./config/react-query";
import { routeTree } from "./routeTree.gen";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const queryClient = createQueryClient();
const persister = createIDBPersister("users-react-query");

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient,
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        persister,
      }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  );
}
