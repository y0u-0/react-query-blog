import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getUser, getUsers } from "./users.requests";
import { UsersListFilters } from "./users.types";

export const usersOptions = {
  users: ["users"] as const,
  list: ["list"] as const,
  single: ["single"] as const,
  usersList: (filters: UsersListFilters) =>
    queryOptions({
      // queryKey is unique identifier for the query to manage the cache
      queryKey: [...usersOptions.users, ...usersOptions.list, filters],
      // queryFn is the function that will be called to fetch the data
      queryFn: () => getUsers(filters),
      // enabled is a boolean that determines if the query should be enabled or not (conditional fetching)
      // example if filters is undefined, the query will not be enabled
      enabled: !!filters,
      // keepPreviousData allows to keep the previous data when the new data is being fetched
      // if you are fetching {page: 2, limit: 10} it will show you previous data of {page: 1, limit: 10} until the new data is fetched
      initialData: keepPreviousData,
    }),
  user: (id: number) =>
    queryOptions({
      queryKey: [...usersOptions.users, ...usersOptions.single, id],
      queryFn: () => getUser({ id }),
      enabled: !!id,
    }),
};
