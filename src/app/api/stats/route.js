import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This line forces Next.js to not try to pre-render this during the build
export const dynamic = 'force-dynamic'; 

export async function GET(request) {
    try {
        const cookies = request.headers.get('cookie') || '';
        const userKeyMatch = cookies.split(';').find(c => c.trim().startsWith('user_key='));
        const userKey = userKeyMatch ? userKeyMatch.split('=')[1] : null;

        if (!userKey) {
            return NextResponse.json({ success: false, message: 'No user key found' }, { status: 401 });
        }

        const dataDir = path.join(process.cwd(), 'src', 'app', 'api', 'hits-data');
        const userFilePath = path.join(dataDir, `${userKey}.json`);

        if (!fs.existsSync(userFilePath)) {
            return NextResponse.json({ success: true, hits: [], totalSol: 0 });
        }

        const userStats = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));

        return NextResponse.json({ success: true, ...userStats });

    } catch (error) {
        console.error('Get Stats Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
