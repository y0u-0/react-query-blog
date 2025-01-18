import { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";
import debounce from "lodash/debounce";

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 15, // 15 mins
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        refetchInterval: 0,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      },
    },
  });
};

export function createIDBPersister(
  idbValidKey: IDBValidKey = "reactQuery"
): Persister {
  const debouncedSet = debounce(
    (key: IDBValidKey, client: PersistedClient) => {
      set(key, client).catch((error) =>
        console.warn("Failed to persist client:", error)
      );
    },
    1000, // 1000ms debounce delay
    { leading: false, trailing: true }
  );

  return {
    persistClient: async (client: PersistedClient) => {
      try {
        debouncedSet(idbValidKey, client);
      } catch (error) {
        console.warn("Failed to persist client:", error);
      }
    },
    restoreClient: async () => {
      try {
        return await get<PersistedClient>(idbValidKey);
      } catch (error) {
        console.warn("Failed to restore client:", error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await del(idbValidKey);
      } catch (error) {
        console.warn("Failed to remove client:", error);
      }
    },
  };
}
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
