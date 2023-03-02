import { Center, Loader } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" && data === null) {
      if (router.pathname === "/") router.push("/auth/signin");
    }
  }, [status, data, router]);

  if (status === "loading") {
    return (
      <Center sx={{ width: "100vw", height: "100vh" }}>
        <Loader size={"lg"} />
      </Center>
    );
  }
  if (status === "authenticated" && data) return children;

  return <div>AuthGuard</div>;
};

export default AuthGuard;
