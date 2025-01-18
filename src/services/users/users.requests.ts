import { supabase } from "../../lib/supabase";
import {
  CreateOrUpdateUserRequest,
  CreateUserResponse,
  GetUserResponse,
  GetUsersResponse,
  UsersListFilters,
} from "./users.types";

export const getUsers = async ({
  page = 1,
  limit = 10,
}: UsersListFilters): Promise<GetUsersResponse> => {
  const { data, error, count } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .range((page - 1) * limit, page * limit - 1)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch users");
  }

  return {
    data: data.map((user) => ({
      id: user.id,
      email: user.email || "",
      name: user.name || "",
      job: user.job || "",
      createdAt: user.created_at,
    })),
    page,
    total: count || 0,
  };
};

export const getUser = async ({
  id,
}: {
  id: number;
}): Promise<GetUserResponse> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Failed to fetch user");
  }

  return {
    data: {
      id: data.id,
      email: data.email || "",
      name: data.name || "",
      job: data.job || "",
      createdAt: data.created_at,
    },
  };
};

export const createUser = async ({
  user,
}: {
  user: CreateOrUpdateUserRequest;
}): Promise<CreateUserResponse> => {
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: user.name,
      job: user.job,
      email: user.email,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Failed to create user");
  }

  return {
    id: data.id.toString(),
    name: data.name || "",
    job: data.job || "",
    email: data.email || "",
    createdAt: data.created_at,
  };
};

export const updateUser = async ({
  id,
  user,
}: {
  id: number;
  user: CreateOrUpdateUserRequest;
}): Promise<Omit<CreateUserResponse, "id">> => {
  const { data, error } = await supabase
    .from("users")
    .update({
      name: user.name,
      job: user.job,
      email: user.email,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to update user");
  }

  return {
    name: data.name || "",
    job: data.job || "",
    email: data.email || "",
    createdAt: data.created_at,
  };
};

export const deleteUser = async ({ id }: { id: number }): Promise<void> => {
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete user");
  }
};
