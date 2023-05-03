import { Client, Collection, User } from "discord.js";
import { QuickDB } from "quick.db";
import { Command } from "./Command.js";
import { Event } from "./Events.js";
import { Database } from "./Database.js";
import { type } from "os";
import { GameData, GuildSchema, Rank, UserSchema } from "./types.js";

const db = new QuickDB<UserSchema>({filePath:"database/database.sqlite"});


export class Core extends Client {
    commands = new Collection<string, Command>();
    events = new Collection<string, Event>();
    cooldowns = new Collection<string, Collection<string, number>>();
    database = {
        users:new Database<UserSchema>(db,"users",{
            exp:0,
            wins:0,
            loses:0,
            gamesPlayed:0,
            rank:Rank.Unranked,
            level:0
        }),
        guilds:new Database<GuildSchema>(db,"guilds",{
            gameLogs:""
        }),
        games:db.table("games") as QuickDB<GameData> // oyunlar için fetch'e gerek yok ondan böyle kalabilirler
    };
    async checkLevel(user:User){
        const db = await this.database.users.fetch(user.id);
        db.level = Math.floor(db.exp/100) // 100 xp'de bir level
        db.rank = Math.floor(db.level/5) // 5 level (500 xp)'de bir rank
        this.database.users.getDatabase().set(user.id,db);
    }
}