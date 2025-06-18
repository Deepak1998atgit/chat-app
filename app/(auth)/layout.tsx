
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      router.replace("/chat");
    } else {
      setLoading(false); 
    }
  }, [router]);
  if (loading) return null; 
  return <>{children}</>;
}
