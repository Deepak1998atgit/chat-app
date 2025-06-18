"use client";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/sign-up");
  };
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e8f0fe] via-[#ffffff] to-[#f1f5f9] flex items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-purple-600">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="text-lg font-semibold tracking-wide">
              Chat Together
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Chat with your friends in real time
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Join a vibrant community where conversations flow effortlessly.
            Instantly connect, collaborate, and stay in touch — all in one
            place.
          </p>
          <div className="flex justify-center md:justify-start">
            <Button
              onClick={handleClick}
              variant="outline"
              className="w-full max-w-xs gap-2 border-gray-300 shadow-sm hover:bg-gray-100"
            >
              Continue with Google
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Use your Google account to log in or sign up.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/globe.svg"
            alt="Chat Illustration"
            width={100}
            height={100}
            className="w-1/2 max-w-md object-contain"
          />
        </div>
      </div>
    </div>
  );
}
