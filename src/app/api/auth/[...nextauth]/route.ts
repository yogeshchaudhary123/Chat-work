import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"; 

// Define the API route handler for both GET and POST requests
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
