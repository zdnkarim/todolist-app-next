import { logout } from "@/controllers/UserController";
import { NextRequest } from "next/server";

export const DELETE = async (req: NextRequest) => {
  return await logout(req);
};
