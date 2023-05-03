import { ChatInputCommandInteraction, ContextMenuCommandInteraction, PermissionResolvable, RESTPostAPIApplicationCommandsJSONBody, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";
import { Core } from "./Core";

export interface Command {
    name: string;
    description: string;
    permissions: PermissionResolvable[];
    requiredPermissions: PermissionResolvable[];
    cooldown: number;
    execute: (client: Core, interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction) => void;
    slashData: RESTPostAPIApplicationCommandsJSONBody;
}