"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove("authToken");
    router.push("/");
  };
  return (
    <Button className="bg-black text-white" onClick={handleLogout}>
      Logout
    </Button>
  );
}
