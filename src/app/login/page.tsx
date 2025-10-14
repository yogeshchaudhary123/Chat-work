
'use client'
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import RouteGuard from "@/app/components/RouteGuard";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (!res?.ok){ setError('Invalid email or password');}
    else{ 
        window.location.href = '/';
        }
  };

  return (
        <RouteGuard>

            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-black">Email</label>
                    <input
                    type="email"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm text-black" >Password</label>
                    <input
                    type="password"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Login
                </button>
                </form>

                <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">or</p>
                <button
                    onClick={() => signIn('google')}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                >
                    Continue with Google
                </button>
                </div>
            </div>
            </div>
        </RouteGuard>
  );
}
