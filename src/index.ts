import { config } from "dotenv";
import { Core } from "./utils/class/Core";
import loadCommands from "./utils/handlers/commands";
import loadEvents from "./utils/handlers/events";
import { join } from "path";
import { cpSync, existsSync } from "fs";

config();

const client = new Core({
    intents: ["GuildMembers","MessageContent","Guilds"]
});

loadCommands(client)
loadEvents(client)

client.login(process.env.token);


const dir = join(process.cwd(),'images','hangman');

if(!existsSync(join(dir,'i̇.png')))
cpSync(join(dir,'i.png'),join(dir,'i̇.png'));