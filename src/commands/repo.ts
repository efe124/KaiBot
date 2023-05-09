import { ApplicationCommandType,ChatInputCommandInteraction } from "discord.js";
import { Command } from "../utils/class/Command";
import {Core} from "../utils/class/Core";

const c: Command = {
    name: 'repo',
    description: 'Botun github reposuna bir link',
    cooldown: 3,
    permissions: [],
    requiredPermissions: [],
    async execute(client:Core, interaction:ChatInputCommandInteraction) {
       interaction.reply({ephemeral:true,content:"https://github.com/efe124/KaiBot"});
    },
    slashData: {
        name: 'repo',
        description: 'Botun github reposuna bir link',
        type: ApplicationCommandType.ChatInput,
        dm_permission: false,
        description_localizations:{
            "en-US":"A link to this Bot's github repo"
        }
    }
};

export default c;