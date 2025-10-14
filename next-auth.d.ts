// next-auth.d.ts
import NextAuth,{ DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string; // Add id property
            email: string;
            name?: string; 
            image?: string; 
            role?: string;
            token?: string;
        };
    }

    interface User {
        id: string;
        role: string;
      }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string; // Add id property
        email: string;
        name?: string; 
        image?: string; 
        role?: string; 
        token?: string;
    
    }
  }


