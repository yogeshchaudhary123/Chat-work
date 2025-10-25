import  { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { encode, decode } from 'next-auth/jwt';
import axios from "axios";

const API_BASE_URL =  process.env.NEXT_PUBLIC_API_URL;

type UserWithToken = {
  id: string;
  email: string;
  role: string;
  name: string;
  image: string;
  accessToken: string;
};
console.log(API_BASE_URL,'api base url');

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  jwt: { encode, decode },
  providers: [
    CredentialsProvider({
      name: "Node Api",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${API_BASE_URL}/api/auth/user-login`, {
            email: credentials?.email,
            password: credentials?.password,
          }, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const user = res.data.user;
          if (user) {
            console.log(user,'user')
             return { id: user.id, email: user.email, role: user.role , name: user.name , image:user.image , accessToken: user.token, };
          
          } else {
            return null; // Return null if login failed
          }
        } catch (error) {
          // Handle error if the API request or login process fails
          console.error("Error during login:", error);
          return null;
        }
      },
     
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
       if (user) {
        const typedUser = user as UserWithToken;
        token.id = typedUser.id;
        token.role = typedUser.role;
        token.name = typedUser.name;
        token.email = typedUser.email;
        token.image = typedUser.image;
        token.accessToken = typedUser.accessToken;
      }
      return token;
    },
    async session({session,token }) {

        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          session.user.image = token.image as string;
          session.user.token = token.accessToken as string;
         
        }
      return session;
    },
  },
  debug:true,
};

