"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || "Login failed");
        setLoading(false);
        return;
      }
      router.push(params.get("from") || "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0A0A0A] px-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-[380px] p-8 bg-[#111111] border border-[#2D2D2D]"
      >
        <div className="flex items-center gap-[10px]">
          <span className="w-[10px] h-[10px] bg-[#FFD600]" />
          <span className="font-grotesk text-[13px] font-bold text-[#F5F5F0] tracking-[2.5px]">
            BLUEZOID ADMIN
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-ibm-mono text-[10px] text-[#666666] tracking-[1.5px]">
              USERNAME
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className="h-[44px] px-4 bg-[#0A0A0A] border border-[#3D3D3D] text-[#F5F5F0] font-ibm-mono text-[13px] outline-none focus:border-[#FFD600] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-ibm-mono text-[10px] text-[#666666] tracking-[1.5px]">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[44px] px-4 bg-[#0A0A0A] border border-[#3D3D3D] text-[#F5F5F0] font-ibm-mono text-[13px] outline-none focus:border-[#FFD600] transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="font-ibm-mono text-[11px] text-red-400 tracking-[0.5px]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center h-[48px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors disabled:opacity-60"
        >
          <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </span>
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
