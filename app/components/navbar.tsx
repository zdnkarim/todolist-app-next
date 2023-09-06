"use client";
import Link from "next/link";
import ButtonAuth from "./auth/button.auth";
import { useState, useEffect, useMemo, SyntheticEvent } from "react";
import axios, { AxiosError } from "axios";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    getMe();
  }, [token]);

  const getMe = async () => {
    if (token) {
      try {
        await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setIsLogin(true);
      } catch (e) {
        const error = e as AxiosError;
        if (error.response) {
          const response: any = error.response;
          console.log(response);
          if (response.status === 201) {
            setIsLogin(true);
            return localStorage.setItem(
              "token",
              response.data.data.accessToken
            );
          }
          setIsLogin(false);
          localStorage.removeItem("token");
        }
      }
    }
  };

  const handleLogout = async (e: SyntheticEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    try {
      const response = await axios.delete("/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setIsLogin(false);
      alert(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
          <Link href={"/"} className="items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Todo App
            </span>
          </Link>
          {isLogin ? (
            <button
              className="btn bg-transparent bordered border-blue-700 hover:bg-blue-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <ButtonAuth />
          )}
          {/* <button className="btn bg-transparent bordered hover:bg-blue-900 border-blue-900">
            Login
          </button> */}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
