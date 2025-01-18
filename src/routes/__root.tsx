import { useQueryClient } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { usersOptions } from "../services/users";
import { initialState } from "../stores/users";

const ReactQueryDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import("@tanstack/react-query-devtools").then((res) => ({
        default: res.ReactQueryDevtools,
      }))
    );

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      }))
    );

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const queryClient = useQueryClient();
  useEffect(() => {
    setTimeout(() => {
      queryClient.prefetchQuery(usersOptions.usersList(initialState.filters));
      queryClient.prefetchQuery(
        usersOptions.usersList({
          ...initialState.filters,
          page: initialState.filters.page + 1,
        })
      );
    }, 100);
  }, [queryClient]);
  return (
    <>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
