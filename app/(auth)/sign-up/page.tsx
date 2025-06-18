"use client";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import GoogleLoginButton from "@/components/ui/googleButton";
export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] via-[#e3ebf0] to-[#dfe6ed] px-4">
      <Card className="w-full max-w-md text-center shadow-xl border border-gray-200 rounded-3xl backdrop-blur-sm">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-between items-center   gap-4">
            <Sparkles className="w-20 h-20 text-purple-600 animate-pulse" />
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-pulse" />
            <Image
              src="/globe.svg"
              alt="Globe"
              width={45}
              height={45}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Join the Chat
          </h1>
          <p className="text-sm text-gray-500">
            Connect with your friends and chat in real time.
          </p>
          <div className="flex justify-center">
            <GoogleLoginButton/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
