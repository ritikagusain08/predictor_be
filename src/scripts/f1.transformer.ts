// transform the f1 raw data to the f1 data

// define types for the f1 raw data

type RawTeam = {
    team_info:{
        id: number;
        name: string;
        short: string;
    }
    drivers: RawPlayer[];
}

type RawPlayer = {
    id: number;
    fullName: string;
    skill: string;
    active: boolean;
}

type RawRace = {
    matchId: number;
    round: number;
    location : {
        circuit: string;
        short: string;
    }
    timings: {
        start: string;
        end: string;
    }
    status: number;
}

type RawF1Data = {
    season: string;
    teamsData: RawTeam[];
    raceCalendar: RawRace[];
}

// transform the raw data to the f1 data

export const transformTeams = (rawData: RawF1Data) => { 
    return rawData.teamsData.map((team) => {  // map over the teams data
        return {
            teamId: team.team_info.id.toString(),
            teamName: team.team_info.name,
            teamShortName: team.team_info.short
        }
    })
}

export const transformPlayers = (rawData: RawF1Data) => {
   const players : any[] = [];  // array to store the players

   for (const team of rawData.teamsData) {   // loop through the teams data
    for (const player of team.drivers) {  // loop through the players data
        players.push({  // push the player data to the players array
            playerId: player.id.toString(),
            playerName: player.fullName,
            playerSkill: player.skill,  
            isActive: player.active,
            teamId: team.team_info.id.toString()
        })
    }
   }
  return players;   // return the players array
}

export const transformRaces = (rawData: RawF1Data) => {
    return rawData.raceCalendar.map((race) => {  // map over the races data
        return {  // return the race data
            matchId: race.matchId,
            gamedayId: race.round,
            circuitLocation: race.location.circuit,
            circuitShortName: race.location.short,
            sessionStartDate: new Date(race.timings.start),
            sessionEndDate: new Date(race.timings.end),
            season: rawData.season,
            status: race.status
        }
    })
}