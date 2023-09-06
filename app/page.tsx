"use client";
import { accessTokenAtom } from "@/constants/atom.constant";
import { useAtom } from "jotai";
import { useEffect } from "react";
export default function Home() {
  const [token, setToken] = useAtom(accessTokenAtom);

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
