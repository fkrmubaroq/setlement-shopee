import { useAuthStore } from "@/store";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Settlement Shopee
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your Shopee settlements efficiently
      </p>

      {isAuthenticated ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-700">
            Welcome back, <span className="font-semibold">{user?.name}</span>!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">
            Please log in or register to get started.
          </p>
        </div>
      )}
    </div>
  );
}
