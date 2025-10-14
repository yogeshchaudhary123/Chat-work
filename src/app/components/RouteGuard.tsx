"use client"; 
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import cookie from 'js-cookie';

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { status,data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const [isRedirecting, setIsRedirecting] = useState(false); // Initially, no redirection
  useEffect(() => {
    console.log(status)
    // Avoid checking if status is still loading
    if (status === "loading") return;
    if (session?.user?.token){
      console.log(session)
      cookie.set('token', session?.user?.token, { expires: 7 });
    }
    // Handle unauthenticated users and prevent infinite redirection loop
    if (status === "unauthenticated" && pathname !== "/login") {
      setIsRedirecting(true); // Set redirecting state before push
      router.push("/login");
    } else if (status === "authenticated" && pathname === "/login") {
      setIsRedirecting(true); // Set redirecting state before push
        router.push("/");
    }
    else if (status === "authenticated" ) {
     setIsRedirecting(false);
      
    }
   
    
  }, [status, router, pathname ,session]);

  // If the session is still loading or we are redirecting, show the loading indicator
  if (status === "loading" || isRedirecting) {
    return <p>loading</p>;
  }

  return <>{children}</>;
};

export default RouteGuard;
