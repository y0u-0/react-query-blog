import { createFileRoute, Link } from "@tanstack/react-router";
import { UsersList } from "../components/users-list";
import { usersOptions } from "../services/users";
import { initialState } from "../stores/users";
import { useEffect } from "react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  // beforeLoad: async ({ context }) => {
  //   const filters = initialState.filters;
  //   context.queryClient.prefetchQuery(usersOptions.usersList(filters)),
  //     context.queryClient.prefetchQuery(
  //       usersOptions.usersList({
  //         ...filters,
  //         page: filters.page + 1,
  //       })
  //     );
  // },
});

function HomeComponent() {
  return (
    <div className="h-screen p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <Link to="/users/create" className="text-white">
          Create User
        </Link>
      </div>
      <hr className="border-gray-200 my-5" />
      <UsersList />
    </div>
  );
}
