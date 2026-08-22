import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';

interface AdminLoginViewProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onNavigate }) => {
  const { loginAdmin } = useSite();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError('Email is required');
    setLoading(true);
    setError('');

    const res = await loginAdmin(email.trim(), password);
    setLoading(false);
    if (res.success) {
      onNavigate('/admin');
    } else {
      setError(res.error || 'Incorrect email or password.');
    }
  };

  return (
    <main className="admin-denied">
      <form
        onSubmit={handleSubmit}
        className="contact-form"
        style={{ width: 'min(430px, calc(100vw - 30px))' }}
      >
        <a
          className="logo"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
        >
          <img src="/purelk-wordmark.png" alt="PURE.LK" />
        </a>
        <h1>Admin login</h1>
        {error && <p className="form-error">{error}</p>}
        <input
          type="email"
          name="email"
          required
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
};

