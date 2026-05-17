import { prisma } from '../config/prisma.ts'
import fs from 'fs'  // file system module
import path from 'path'  // path module

const filePath = path.join(__dirname, '../../data/f1_raw_data.json');  // join the path to the file

const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));   // read the file as a string

console.log(rawData);

async function seedTeams() {
    for (const team of rawData.teamsData){  // iterate over the teams data

        const teamId = team.team_info.id.toString();

        if(!teamId) {
            console.log('Team ID is missing for team:', team.team_info.name);
            continue;
        }

        await prisma.team.upsert({    // upsert is a combination of update and create. if the team already exists, update it, otherwise create it.
            where: {
                teamId: teamId
            },
            update: {
                teamName: team.team_info.name,
                teamShortName: team.team_info.short,
            },
            create: {
                teamId: teamId,
                teamName: team.team_info.name,
                teamShortName: team.team_info.short,
            },
        })
    }
}

async function seedPlayers() {
    for (const team of rawData.teamsData){
        for (const player of team.drivers){

            const playerId = player.id.toString();
            const teamId = team.team_info.id.toString();

            if(!playerId || !teamId) {
                console.log('Player ID or team ID is missing for player:', player.fullName);
                continue;
            }


            await prisma.player.upsert({
                where: {
                    playerId: playerId
                },
                update: {
                    playerName: player.fullName,
                    playerSkill: player.skill,
                    isActive: player.active,
                    teamId: teamId,
                },
                create: {
                    playerId: playerId,
                    playerName: player.fullName,
                    playerSkill: player.skill,
                    isActive: player.active,
                    teamId: teamId,
                },
            })
        }
    }
}

async function seedMatches() {
    for (const race of rawData.raceCalendar){
        const matchData = {
            matchId: race.round,
            gamedayId: race.round,
            circuitLocation: race.location.circuit,
            circuitShortName: race.location.short,
            sessionStartDate: race.timings.start,
            sessionEndDate: race.timings.end,
            season: rawData.season,
            status: 0
        }

        await prisma.match.upsert({
            where: {
                matchId: matchData.matchId
            },
            update: {
                gamedayId: matchData.gamedayId,
                circuitLocation: matchData.circuitLocation,
                circuitShortName: matchData.circuitShortName,
                sessionStartDate: new Date(race.timings.start),  
                sessionEndDate: new Date(race.timings.end),
                season: matchData.season,
            },
            create: matchData,
        })
    }
}

async function main() {           // main function to seed the data
    console.log('Seeding teams...')
    await seedTeams() 
    console.log('Seeding players...')
    await seedPlayers()
    console.log('Seeding matches...')
    await seedMatches()
    console.log('Seeding completed successfully')
}

main()   // call the main function
    .catch((error) => {   // catch the error if any
        console.error('Error seeding data:', error)
        process.exit(1)
    })
    .finally(async () => {   // finally disconnect from the database
        await prisma.$disconnect()
    })