import { LoginForm } from "@/features/auth";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <LoginForm />
      </div>
    </div>
  );
}
