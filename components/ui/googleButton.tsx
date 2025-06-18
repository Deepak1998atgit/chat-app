"use client";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";
import { FC } from "react";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";

interface GoogleDecodedCredential {
  name: string;
  email: string;
  picture?: string;
}

const GoogleLoginButton: FC = () => {
   const router = useRouter(); 
  const setUser = useUserStore((state) => state.setUser);
  const handleSuccess = async (credentialResponse:CredentialResponse) => {
    try {
      const credential = credentialResponse.credential;
      if (!credential) {
        console.error("No credential returned");
        return;
      }
      const decoded = jwtDecode<GoogleDecodedCredential>(credential);
      const response = await axios.post("/api/auth", {
        name: decoded.name,
        email: decoded.email,
        image: decoded.picture,
      });
      Cookies.set("authToken", response?.data?.token, {
        expires:5/24,
        sameSite: "Lax",
      });
      setUser({
        name: decoded.name,
        email: decoded.email,
        image: decoded.picture,
      });
       router.push("/chat");
    } catch (error) {
      console.error("Login handling error:", error);
    }
  };
  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.info("Login Failed");
      }}
    />
  );
};
export default GoogleLoginButton;
