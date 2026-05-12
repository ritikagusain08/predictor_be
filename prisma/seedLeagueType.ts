import { prisma } from "../src/config/prisma.ts";


async function main() {

    console.log("Seeding League Templates...");

    await prisma.leagueTemplate.createMany({
        data: [
        {
            name: "PRIVATE",
            requireLeagueCode: true,
            isSearchable: false,
            allowUserLeave: true,
            allowRenaming: true,
            allowAdminDelete: true,
            allowMemberRemoval: true,
            creatorRole: "USER",
            hasMatchRange: false,
            defaultMaxMembers: 999999,
            maxLeaguesPerUser: null,
        },
        // PUBLIC
        {
            name: "PUBLIC",
            requireLeagueCode: false,
            isSearchable: true,
            allowUserLeave: false,
            allowRenaming: true,
            allowAdminDelete: false,
            allowMemberRemoval: false,
            creatorRole: "USER",
            hasMatchRange: false,
            defaultMaxMembers: 999999,
            maxLeaguesPerUser: null,
        },
        // SPONSORED
        {
            name: "SPONSORED",
            requireLeagueCode: false,
            isSearchable: true,
            allowUserLeave: false,
            allowRenaming: true,
            allowAdminDelete: false,
            allowMemberRemoval: false,
            creatorRole: "ADMIN",
            hasMatchRange: false,
            defaultMaxMembers: 999999,
            maxLeaguesPerUser: null,
        },
        //MINI
        {
            name: "MINI",
            requireLeagueCode: false,
            isSearchable: true,
            allowUserLeave: false,
            allowRenaming: true,
            allowAdminDelete: false,
            allowMemberRemoval: false,
            creatorRole: "ADMIN",
            hasMatchRange: true,
            defaultMaxMembers: 999999,
            maxLeaguesPerUser: null,
        },
        //MID SEASON LEAGUE
        {
            name: "MID_SEASON_LEAGUE",
            requireLeagueCode: false,
            isSearchable: true,
            allowUserLeave: false,
            allowRenaming: true,
            allowAdminDelete: false,
            allowMemberRemoval: false,
            creatorRole: "ADMIN",
            hasMatchRange: true,
            defaultMaxMembers: 999999,
            maxLeaguesPerUser: null,
        }
    ],
    skipDuplicates: true,

    })

    console.log("Seeding Complete.");
}


main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});