// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [key, setKey] = useState('');
    const router = useRouter();

    const handleLogin = (e) => {
        e.preventDefault();
        // Save the key to a cookie
        document.cookie = `user_key=${key}; path=/; max-age=86400`; // 1 day expiry
        
        // Redirect to dashboard
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-emerald-400">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Product Key</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded bg-slate-900 border border-slate-600 focus:border-emerald-500 focus:outline-none"
                            placeholder="Enter your unique key"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded transition">
                        Enter Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
