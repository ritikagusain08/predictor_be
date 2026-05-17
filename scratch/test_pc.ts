import { calculatePoints } from '../src/pointscalculation/pc.service.ts';

async function main() {
    const matchId = 1003; 
    const argMatchId = process.argv[2] ? parseInt(process.argv[2]) : matchId;
    console.log(`Calculating points for matchId: ${argMatchId}`);
    try {
        const result = await calculatePoints({ matchId: argMatchId });
        console.log("Result:", result);
    } catch (e) {
        console.error("Error running PC:", e);
    }
}

main();
