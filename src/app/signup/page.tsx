'use client'
import { useState } from 'react';
import Link from 'next/link';
import RouteGuard from "@/app/components/RouteGuard";

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        window.location.href = '/login?registered=true';
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard>
      <div className="min-h-screen flex items-center justify-center bg-mesh px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">ChatHub</span>
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight">Create an account</h2>
            <p className="text-gray-500 mt-2">Join thousands of people chatting globally.</p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 glass rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-5 py-4 glass rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 ml-1">Password</label>
                <input
                  type="password"
                  className="w-full px-5 py-4 glass rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 ml-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-5 py-4 glass rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-hover hover:scale-[1.02] transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="text-center mt-8 text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
