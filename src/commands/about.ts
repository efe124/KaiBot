import { ApplicationCommandType,ChatInputCommandInteraction, Colors } from "discord.js";
import { Command } from "../utils/class/Command";
import {Core} from "../utils/class/Core";
import { readFileSync } from "fs";
import { join } from "path";
import { embed } from "../utils/functions";

const c: Command = {
    name: 'hakkında',
    description: 'Bot hakkında',
    cooldown: 3,
    permissions: [],
    requiredPermissions: [],
    async execute(client:Core, interaction:ChatInputCommandInteraction) {
       return interaction.reply(embed(Colors.Blue,'Impeccably Code Jam: 2023 için 72 saatte <@525374857769254912> tarafından yapıldı. 3 Adet mini oyuna ve bu oyunların kaydını tutma özelliğine sahip bir bottur.'))
    },
    slashData: {
        name: 'hakkında',
        description: 'Bot hakkında',
        type: ApplicationCommandType.ChatInput,
        dm_permission: false,
        description_localizations:{"en-US":'About this bot'},
        name_localizations:{"en-US":'about'}
    }
};

export default c;