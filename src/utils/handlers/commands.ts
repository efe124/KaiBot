import exp = require("constants");
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../class/Command";
import { Core } from "../class/Core";

const commandsdir = join(process.cwd(), "dist", "commands");

export default function loadCommands(client: Core) {
    const commandFiles = readdirSync(commandsdir).filter(r => r.endsWith(".js"));

    commandFiles.forEach(async (file) => {
        const cmd = await import(`${commandsdir}/${file}`).then(r => r.default) as Command;

        client.commands.set(cmd.name, cmd);
    });
}

export async function registerCommands(client: Core, type: "guild" | "global") {
    switch (type) {
        case "global":
            await client.application.commands.set(client.commands.map(r => r.slashData));
            console.log("Registered global commands");
            break;
        case "guild":
            const mainGuild = client.guilds.cache.find(r => r.id === process.env.mainguildid);

            await mainGuild.commands.set(client.commands.map(r => r.slashData));
            console.log("Redistered guild comamnds");
            break;
    }
}