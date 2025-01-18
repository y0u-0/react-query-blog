import { useLocation, useNavigate } from "@tanstack/react-router";
import { UserData, useDeleteUser, usersOptions } from "../services/users";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStoreFilters } from "../stores/users";

export const UserComponent = ({ user }: { user: UserData }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const filters = useUserStoreFilters();
  const pathname = useLocation({
    select: ({ pathname }) => pathname,
  });
  const userDetailsPage = pathname.includes("/users");
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleDelete = async () => {
    deleteUser(
      { id: user.id },
      {
        onSuccess: () => {
          if (userDetailsPage) {
            navigate({ to: "/" });
            queryClient.invalidateQueries({
              queryKey: usersOptions.usersList(filters),
            });
            queryClient.invalidateQueries({
              queryKey: usersOptions.user(user.id),
            });
          }
        },
        onError: (error) => {
          console.error("Failed to delete user:", error);
        },
      }
    );
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 w-full mx-auto"
      onClick={() => {
        if (!userDetailsPage) {
          navigate({
            to: "/users/$userId",
            params: {
              userId: `${user.id}`,
            },
          });
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={`https://placehold.co/100x100/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}/png?text=${user.name.charAt(0)}`}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          disabled={isDeletingUser}
        >
          {isDeletingUser ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};
