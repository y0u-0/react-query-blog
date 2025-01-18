import { useQueryClient } from "@tanstack/react-query";
import { usersOptions, useUsersList } from "../services/users";
import { GetUsersResponse, UserData } from "../services/users/users.types";
import { useUsersStoreActions, useUserStoreFilters } from "../stores/users";
import { UserComponent } from "./user-component";
import { useEffect } from "react";

export const UsersList = () => {
  const queryClient = useQueryClient();
  const filters = useUserStoreFilters();
  const { setPage } = useUsersStoreActions();
  const { data, isLoading, error } = useUsersList({ filters });
  const response = data as GetUsersResponse;



  // useEffect(() => {
  //   response?.data.forEach((user: UserData) => {
  //     queryClient.prefetchQuery(usersOptions.user(user.id));
  //     queryClient.prefetchQuery(usersOptions.userCount(user.id));
  //   });
  // }, [response]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        Error: {error.message}
      </div>
    );
  }


  const totalPages = Math.ceil((response?.total || 0) / filters.limit);

  const prefetchPages = (page: number) => {
    // Only prefetch if the page is valid
    if (page >= 1 && page <= totalPages) {
      queryClient.prefetchQuery(
        usersOptions.usersList({
          page,
          limit: filters.limit,
        })
      );
    }
  };


  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="grid grid-cols-2 gap-5">
        {response?.data.map((user: UserData) => (
          <UserComponent key={user.id} user={user} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => {
            setPage(filters.page - 1);
            // Prefetch previous page
            prefetchPages(filters.page - 2);
          }}
          disabled={filters.page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {filters.page} of {totalPages}
        </span>
        <button
          onClick={() => {
            setPage(filters.page + 1);
            // Prefetch next page
            prefetchPages(filters.page + 2);
          }}
          disabled={filters.page >= totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};
