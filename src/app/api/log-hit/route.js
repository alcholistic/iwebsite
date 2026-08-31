// src/app/api/log-hit/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const { wallet, amount, signature } = await request.json();
        
        // 1. Get the User Key from cookies
        const cookies = request.headers.get('cookie') || '';
        const userKeyMatch = cookies.split(';').find(c => c.trim().startsWith('user_key='));
        const userKey = userKeyMatch ? userKeyMatch.split('=')[1] : null;

        if (!userKey) {
            return NextResponse.json({ success: false, message: 'No user key found' }, { status: 401 });
        }

        // 2. Define data path
        const dataDir = path.join(process.cwd(), 'src', 'app', 'api', 'hits-data');
        const userFilePath = path.join(dataDir, `${userKey}.json`);

        // Initialize file if not exists
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(userFilePath)) {
            fs.writeFileSync(userFilePath, JSON.stringify({ hits: [], totalSol: 0, key: userKey }, null, 2));
        }

        // 3. Read current data
        let userStats = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));

        // 4. Update stats
        userStats.hits.push({ wallet, amount, signature, timestamp: new Date().toISOString() });
        userStats.totalSol += parseFloat(amount || 0);

        // 5. Save back
        fs.writeFileSync(userFilePath, JSON.stringify(userStats, null, 2));

        return NextResponse.json({ success: true, message: 'Hit logged' });

    } catch (error) {
        console.error('Log Hit Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
