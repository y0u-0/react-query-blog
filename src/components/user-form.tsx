import { useState } from "react";
import type { CreateOrUpdateUserRequest } from "../services/users";
import { useCreateUser, useUpdateUser } from "../services/users";

interface UserFormProps {
  initialData?: CreateOrUpdateUserRequest;
  userId?: number;
  onSuccess?: () => void;
}

export const UserForm = ({ initialData, userId, onSuccess }: UserFormProps) => {
  const [formData, setFormData] = useState<CreateOrUpdateUserRequest>(
    initialData ?? {
      name: "",
      job: "",
      email: "",
    }
  );

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (userId) {
        await updateMutation.mutateAsync({
          id: userId,
          user: formData,
        });
      } else {
        await createMutation.mutateAsync({
          user: formData,
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="text"
          id="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="job"
          className="block text-sm font-medium text-gray-700"
        >
          Job
        </label>
        <input
          type="text"
          id="job"
          value={formData.job}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, job: e.target.value }))
          }
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Saving..." : userId ? "Update User" : "Create User"}
      </button>
    </form>
  );
};
