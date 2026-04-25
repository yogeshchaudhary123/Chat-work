'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
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
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setMessage('Password has been successfully reset.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh px-4">
        <div className="glass p-8 rounded-[2.5rem] text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Invalid Link</h2>
          <p className="text-gray-500 mb-6">The reset password link is invalid or has expired.</p>
          <Link href="/forgot-password" className="text-primary font-bold hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">ChatHub</span>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight">New Password</h2>
          <p className="text-gray-500 mt-2">Create a new password for your account.</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl mb-6">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 text-sm p-4 rounded-2xl mb-6">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 ml-1">New Password</label>
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
              <label className="block text-sm font-semibold mb-2 ml-1">Confirm New Password</label>
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
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
