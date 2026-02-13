import { useQuery } from "@tanstack/react-query";

interface AuthUser {
  id: string;
  email: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 30000,
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to check auth");
      return res.json();
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };
}
