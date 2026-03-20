import { RegisterForm } from "@/features/auth";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <RegisterForm />
      </div>
    </div>
  );
}
