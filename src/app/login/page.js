'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

        console.log("Attempting to login with key:", key);

        // Query for the key. We select 'id' to see if we got anything back.
        const { data, error: dbError } = await supabase
            .from('authorized_keys')
            .select('id, key_value')
            .eq('key_value', key)
            // Check if 'active' is true. 
            // WARNING: If 'active' is a STRING 'true' in your DB, change this to eq('active', 'true')
            .eq('active', true)
            .maybeSingle(); 

        // --- DEBUGGING ---
        console.log("Supabase Response Data:", data);
        console.log("Supabase Error:", dbError);

        if (dbError) {
            setError("Network Error: " + dbError.message);
            setLoading(false);
            return;
        }

        // 1. Check if data is null (no result found)
        // 2. Check if data is an empty array (returned as [])
        // 3. Check if data is an object but empty
        if (!data || (Array.isArray(data) && data.length === 0) || (data && Object.keys(data).length === 0)) {
            setError("Invalid Key or Key is Inactive.");
            setLoading(false);
            return;
        }

        // Success!
        console.log("Login Successful! Redirecting...");
        document.cookie = `user_key=${key}; path=/; max-age=86400`;
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
            </div>
        </div>
    );
}
