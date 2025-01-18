import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserForm } from "../components/user-form";

export const Route = createFileRoute("/users/create")({
  component: CreateUserPage,
});

function CreateUserPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create New User
          </h2>
        </div>
        <UserForm
          onSuccess={() => {
            navigate({ to: "/" });
          }}
        />
      </div>
    </div>
  );
}
