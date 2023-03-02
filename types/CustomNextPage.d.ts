import { NextPage } from "next";

export type CustomeNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};
