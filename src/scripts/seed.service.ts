
import fs from 'fs'  // file system module
import path from 'path'  // path module
import { transformTeams, transformPlayers, transformRaces } from './f1.transformer.ts'
import {createTeam} from '../teams/team.service.ts'
import {createPlayer} from '../players/player.service.ts'
import {createMatch} from '../matches/match.service.ts'

const filePath = path.join(__dirname, '../../data/f1_raw_data.json');  // join the path to the file

const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));   // read the file as a string

console.log(rawData);

export const seedF1DataService =  async function seedF1Data() {
    const teams = transformTeams(rawData);  // transform the teams data
    const players = transformPlayers(rawData);  // transform the players data
    const races = transformRaces(rawData);  // transform the races data
    
    for (const team of teams) {  // loop through the teams data
        await createTeam(team); 
    }
    for (const player of players) {  // loop through the players data
        await createPlayer(player);
    }
    for (const race of races) {
        await createMatch(race);
    }

    return {
        teams: teams.length,
        players: players.length,
        races: races.length
    }
}
