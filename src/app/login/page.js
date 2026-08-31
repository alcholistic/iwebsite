// src/app/login/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import Supabase Client (Make sure you have this installed: npm install @supabase/supabase-js)
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// Replace these with your actual Supabase URL and Anon Key from your Supabase Dashboard
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function LoginPage() {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. Check if key exists in your Supabase table (e.g., 'products' or 'users')
        // CHANGE 'products' TO YOUR ACTUAL TABLE NAME
        // CHANGE 'key' TO YOUR ACTUAL COLUMN NAME
        const { data, error: dbError } = await supabase
            .from('products') // Assuming you have a table named 'products' with a 'key' column
            .select('id')
            .eq('key', key) // Match the input key
            .single();

        if (dbError || !data) {
            setError('Invalid Key. Check your Supabase table.');
            setLoading(false);
            return;
        }

        // 2. Key is valid! Set the cookie and redirect.
        document.cookie = `user_key=${key}; path=/; max-age=86400`;
        
        // 3. Redirect to Dashboard
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-slate-700">
                <h1 className="text-2xl font-bold mb-6 text-emerald-400">Access Terminal</h1>
                
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-slate-300">Product Key</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded bg-slate-900 border border-slate-600 focus:border-emerald-500 focus:outline-none text-white"
                            placeholder="Enter your generated key"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold py-3 rounded transition shadow-lg"
                    >
                        {loading ? 'Verifying...' : 'Initialize Connection'}
                    </button>
                </form>
                
                <p className="text-xs text-slate-500 mt-4 text-center">
                    Connected to Supabase. Redirecting to dashboard upon success.
                </p>
            </div>
        </div>
    );
}
