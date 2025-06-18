"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState, useCallback } from "react";
import { apiCall } from "@/lib/utils/apiCall";
import debounce from "lodash.debounce";
import useUserStore from "@/store/useUserStore";

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export default function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const setUsers = useUserStore((state) => state.setUsers);
  const fetchUsers = useCallback(
    async (keyword?: string) => {
      try {
        const url = keyword
          ? `/api/user?keyword=${encodeURIComponent(keyword)}`
          : "/api/user";
        const response = await apiCall<User[]>({
          url,
          method: "GET",
        });
        if (response) {
          setUsers(response);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    },
    [setUsers]
  );
  const debouncedFetch = useMemo(() => debounce(fetchUsers, 500), [fetchUsers]);
  useEffect(() => {
    debouncedFetch(searchTerm);
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchTerm, debouncedFetch]);
  return (
    <Input
      placeholder="Search by name or email"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
