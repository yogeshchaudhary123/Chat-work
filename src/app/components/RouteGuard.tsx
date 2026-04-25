"use client"; 
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import cookie from 'js-cookie';

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const publicPaths = ["/login", "/signup", "/forgot-password", "/reset-password", "/"];

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.token) {
      cookie.set('token', session?.user?.token, { expires: 7 });
    }

    const isPublicPath = publicPaths.includes(pathname);

    if (status === "unauthenticated" && !isPublicPath) {
      setIsRedirecting(true);
      router.push("/login");
    } else if (status === "authenticated" && (pathname === "/login" || pathname === "/signup")) {
      setIsRedirecting(true);
      router.push("/chat");
    } else {
      setIsRedirecting(false);
    }
  }, [status, router, pathname, session]);

  if (status === "loading" || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading Hub...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
