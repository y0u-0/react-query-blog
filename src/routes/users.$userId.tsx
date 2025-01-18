import { createFileRoute } from "@tanstack/react-router";
import { UserComponent } from "../components/user-component";
import { useUser } from "../services/users";
import { UserForm } from "../components/user-form";

export const Route = createFileRoute("/users/$userId")({
  component: UserPage,
});

function UserPage() {
  const { userId } = Route.useParams();
  const { data, isLoading, error } = useUser({ id: Number(userId) });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>User not found</p>
      </div>
    );
  }

  const user = data.data;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <UserComponent user={user} />
      <UserForm
        userId={user.id}
        initialData={{ name: user.name, job: user.job, email: user.email }}
      />
    </div>
  );
}
