import { redirect } from "next/navigation";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const next = searchParams.next ?? "/admin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl flex flex-col items-center gap-6 w-full max-w-sm">
        <h1 className="text-white text-2xl font-semibold tracking-tight">ALS Admin</h1>
        {searchParams.error && (
          <p className="text-red-400 text-sm">Access denied. Admin only.</p>
        )}
        
          href={`/auth/sign-in?next=${encodeURIComponent(next)}`}
          className="w-full bg-white text-gray-900 font-medium py-3 px-4 rounded-xl text-center hover:bg-gray-100 transition"
        >
          Sign in with Google
        </a>
      </div>
    </div>
  );
}
