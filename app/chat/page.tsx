"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import SearchInput from "@/components/ui/searchInputBox";
import useUserStore from "@/store/useUserStore";
import { v4 as uuidv4 } from "uuid";
import { Skeleton } from "@/components/ui/skeleton";
import LogoutButton from "@/components/log-out/log-out";
const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!);
type Message = {
  _id?: string;
  id?: string;
  content: string;
  conversation?: string;
  createdAt?: string;
  updatedAt?: string;
  sender:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        image?: string;
      };
  receiver?: string;
};
export default function ChatPage() {
  const users = useUserStore((state) => state?.users);
  const currentUser = useUserStore((state) => state?.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    email: string;
    name?: string;
    image?: string;
  } | null>(null);
  useEffect(() => {
    const handleReceiveMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [messages]);
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser?.email) return;
      setLoading(true);
      const res = await fetch(`/api/messages?receiver=${selectedUser?.email}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setLoading(false);
    };
    fetchMessages();
  }, [selectedUser?.email, currentUser?.email]);
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser || !currentUser?.email) return;
    const newMessage: Message = {
      id: uuidv4(),
      sender: currentUser.email,
      receiver: selectedUser.email,
      content: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    socket.emit("send-message", newMessage);
    setInput("");
  };
  const filteredMessages = selectedUser
    ? messages.filter((msg) => {
        const senderEmail =
          typeof msg.sender === "string" ? msg.sender : msg?.sender?.email;
        return (
          senderEmail === currentUser?.email ||
          senderEmail === selectedUser?.email
        );
      })
    : [];
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-2/5 border-r bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        <div className="flex justify-between items-center gap-2">
          <SearchInput />
          <LogoutButton />
        </div>
        <ul className="space-y-2 mt-4">
          {users?.map((user) => (
            <li
              key={user.email}
              onClick={() =>
                user.email !== currentUser?.email &&
                setSelectedUser(user) &&
                setMessages([])
              }
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                selectedUser?.email === user.email
                  ? "bg-blue-200"
                  : "hover:bg-gray-200"
              } ${
                user.email === currentUser?.email
                  ? "bg-gray-300 cursor-default"
                  : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                {user?.image ? (
                  <Image
                    src={user?.image ?? "/globe.svg"}
                    alt={user?.name}
                    width={32}
                    height={32}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <span>
                {user.email === currentUser?.email
                  ? `${user.name} (You)`
                  : user.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardContent
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto space-y-4 py-4"
          >
            {selectedUser ? (
              loading ? (
                Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className={`max-w-full ${
                      index % 2 === 0 ? "self-end" : "self-start"
                    }`}
                  >
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                ))
              ) : (
                filteredMessages.map((msg) => {
                  const senderEmail =
                    typeof msg.sender === "string"
                      ? msg.sender
                      : msg.sender?.email;
                  const isCurrentUser = senderEmail === currentUser?.email;
                  return (
                    <div
                      key={
                        msg._id ||
                        msg.id ||
                        `${senderEmail}-${msg.content}-${
                          msg.createdAt || Date.now()
                        }`
                      }
                      className={`flex flex-col ${
                        isCurrentUser ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-5 py-3 rounded-3xl ${
                          isCurrentUser
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-black rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <p className="text-[10px] text-gray-700 mt-1 text-right">
                          {new Date(
                            msg.createdAt ?? Date.now()
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <p className="text-center text-gray-400 mt-10">
                Select a user to start chatting
              </p>
            )}
          </CardContent>
        </Card>
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <Input
            placeholder={
              selectedUser
                ? "Type your message..."
                : "Select a user to start chatting"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!selectedUser}
          />
          <Button type="submit" disabled={!selectedUser}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
