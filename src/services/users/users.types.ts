export interface CreateOrUpdateUserRequest {
  name: string;
  job: string;
  email: string;
}

export interface CreateUserResponse {
  id: string;
  name: string;
  job: string;
  email: string;
  createdAt: string;
}

export interface GetUsersResponse {
  page: number;
  total: number;
  data: UserData[];
}

export interface GetUserResponse {
  data: UserData;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  job: string;
  createdAt: string;  
}

export interface UsersListFilters { 
  page: number;
  limit: number;
}
