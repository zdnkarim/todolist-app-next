import { NextResponse } from "next/server";

export const response = (status: number, data: any, message: string) => {
  return new NextResponse(
    JSON.stringify({
      data: data,
      message,
    }),
    {
      status: status,
    }
  );
};
