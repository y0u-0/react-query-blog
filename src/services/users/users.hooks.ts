import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MutationConfig, QueryConfig } from "../../config/react-query";
import { usersOptions } from "./users.options";
import { createUser, deleteUser, updateUser } from "./users.requests";
import {
  GetUserResponse,
  GetUsersResponse,
  UsersListFilters,
} from "./users.types";

type useUsersListOptions = {
  filters: UsersListFilters;
  queryConfig?: QueryConfig<typeof usersOptions.usersList>;
};

export const useUsersList = ({ filters, queryConfig }: useUsersListOptions) => {
  return useQuery({
    ...usersOptions.usersList(filters),
    ...queryConfig,
  });
};

type useUserOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof usersOptions.user>;
};

export const useUser = ({ id, queryConfig = {} }: useUserOptions) => {
  const queryClient = useQueryClient();
  return useQuery({
    ...usersOptions.user(id),
    ...queryConfig,
    initialData: () => {
      const queries = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: [...usersOptions.users, ...usersOptions.list],
      });
      const foundUser = queries
        .find(([_, data]) => data?.data?.find((user) => user.id === id))?.[1]
        ?.data?.find((user) => user.id === id);
      return foundUser ? { data: foundUser } : undefined;
    },
  });
};

type useCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({
  mutationConfig,
}: useCreateUserOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createUser,
  });
};

type useUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({
  mutationConfig,
}: useUpdateUserOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: updateUser,
    onMutate: async (variables) => {
      let previousUser = queryClient.getQueryData<GetUserResponse>(
        usersOptions.user(variables.id).queryKey
      );
      queryClient.cancelQueries({
        queryKey: [...usersOptions.users, ...usersOptions.list],
      });
      queryClient.cancelQueries({
        queryKey: usersOptions.user(variables.id).queryKey,
      });
      
      queryClient.setQueryData(usersOptions.user(variables.id).queryKey, {
        data: {
          id: variables.id,
          name: variables?.user?.name || previousUser?.data?.name || "",
          email: variables.user.email || previousUser?.data?.email || "",
          job: variables.user.job || previousUser?.data?.job || "",
          createdAt: previousUser?.data?.createdAt || new Date().toISOString(),
        },
      });
      const queries = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: [...usersOptions.users, ...usersOptions.list],
      });
      queries.forEach(([queryKey, oldData]) => {
        if (oldData?.data) {
          queryClient.setQueryData(queryKey, {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === variables.id ? { ...item, ...variables.user } : item
            ),
          });
        }
      });

      return { previousUser };
    },
    onSuccess: (...args) => {
      const user = args[0];
      const variables = args[1];
      const queries = queryClient.getQueriesData<GetUsersResponse>({
        queryKey: [...usersOptions.users, ...usersOptions.list],
      });
      queries.forEach(([queryKey, oldData]) => {
        if (oldData?.data) {
          queryClient.setQueryData(queryKey, {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === variables.id ? { ...item, ...user } : item
            ),
          });
        }
      });
      queryClient.setQueryData(usersOptions.user(variables.id).queryKey, {
        data: {
          ...user,
          id: variables.id,
        },
      });

      onSuccess?.(...args);
    },
    onError: (error, variables, context) => { 
      console.error(error);
      queryClient.invalidateQueries({
        queryKey: [...usersOptions.users, ...usersOptions.list],
      });
      if (context?.previousUser) {
        queryClient.setQueryData(usersOptions.user(variables.id).queryKey, context?.previousUser);
        queryClient.invalidateQueries({
          queryKey: usersOptions.user(variables.id).queryKey,
        });
      }
    },
  });
};

type useDeleteUserOptions = {
  mutationConfig?: MutationConfig<typeof deleteUser>;
};

export const useDeleteUser = ({
  mutationConfig,
}: useDeleteUserOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      const variables = args[1];
      queryClient.invalidateQueries({
        queryKey: [...usersOptions.users, ...usersOptions.list],
      });
      queryClient.removeQueries({
        queryKey: usersOptions.user(variables.id).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteUser,
  });
};