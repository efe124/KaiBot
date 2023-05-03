import { Interaction, PermissionResolvable } from "discord.js";
import { Core } from "../utils/class/Core.js";
import { Event } from "../utils/class/Events.js";
import { seperateList } from "../utils/functions.js";
import t from "../utils/locale/index.js";
import {checkCooldown} from "../utils/functions.js";
import wordleButton from "../misc/wordleButton.js";
import wordleModal from "../misc/wordleModal.js";
import findTheXButton from "../misc/findTheXButton.js";
import downloadLogsButton from "../misc/download-logsButton.js";
import hangmanButton from "../misc/hangmanButton.js";
import hangmanModal from "../misc/hangmanModal.js";
import gamelogsButton from "../misc/gamelogsButton.js";

const e: Event = {
    key: "interactionCreate",
    on(client: Core, interaction: Interaction) {

        //-Slash Command
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName) ?? null;
            if (!command) return;

            //* Bots permission
            var ret: boolean = false;
            var nhpl: PermissionResolvable[] = [];
            if (command.requiredPermissions) command.requiredPermissions.forEach((perm: PermissionResolvable) => {
                if (!interaction.guild.members.me.permissions.has(perm)) {
                    ret = true;
                    nhpl.push(perm);
                }
            });
            if (ret) {
                const translations = nhpl.map(r => `\`${t(r.toString(), { locale: interaction.locale, namespace: "permissions" })}\``);

                interaction.reply({ content: t("error.perm.bot", { locale: interaction.locale, namespace: "common", parameters: [["perms", seperateList(translations, interaction.locale)]] }) });
                return;
            }


            //* Cooldown
            const cooldown = checkCooldown(client, interaction.user.id, command);
            if (cooldown) {
                interaction.reply({ content: t("error.cooldown", { locale: interaction.locale, namespace: "common", parameters: [["sec", cooldown.toString()]] }), ephemeral: true });
                return;
            }

            //* Execute
            try {
                command.execute(client, interaction);
            } catch (e) {
                interaction.reply({ content: t("error.command", { locale: interaction.locale, namespace: "common" })});
                console.log("Error in "+command.name,e)
            }
        }

        //- Context Menu
        if (interaction.isUserContextMenuCommand()) {

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            //* Bots permission
            var ret: boolean = false;
            var nhpl: PermissionResolvable[] = [];
            if (command.requiredPermissions) command.requiredPermissions.forEach((perm: PermissionResolvable) => {
                if (!interaction.guild.members.me.permissions.has(perm)) {
                    ret = true;
                    nhpl.push(perm);
                }
            });
            if (ret) {
                const translations = nhpl.map(r => `\`${t(r.toString(), { locale: interaction.locale, namespace: "permissions" })}\``);

                interaction.reply({ content: t("error.perm.bot", { locale: interaction.locale, namespace: "common", parameters: [["perms", seperateList(translations, interaction.locale)]] }) });
                return;
            }

            //* Cooldown
            const cooldown = checkCooldown(client, interaction.user.id, command);
            if (cooldown) {
                interaction.reply({ content: t("error.cooldown", { locale: interaction.locale, namespace: "common", parameters: [["sec", cooldown.toString()]] }),ephemeral: true });
                return;
            }

            //* Execute
            try {
                command.execute(client, interaction);
            } catch (e) {
                interaction.reply({ content: t("error.command", { locale: interaction.locale, namespace: "common" })});
                console.log(`An error in command file: ${command.name}.js\n ${e}`);
            }
        }//? is interaction.isUserContext

        if(interaction.isButton()){
            const things = interaction.customId.split("###") //idyi ilk nesne id ve gerisi argümanlar olacak şekilde bişeye dönüştürüyo
            if(things[0] === "wordle") wordleButton(client,interaction,things[1],things[2])
            if(things[0] === "hangman") hangmanButton(client,interaction,things[1],things[2])
            if(things[0]==="findthex") findTheXButton(client,interaction,things[1],things[2])
            if(things[0]==="downloadlogs") downloadLogsButton(client,interaction)
            if(things[0]==="gamelogsclear") gamelogsButton(client,interaction)
        }

        if(interaction.isModalSubmit()){
            const things = interaction.customId.split("###")

            if(things[0]==="wordle") wordleModal(client,interaction,things[1])
            if(things[0]==="hangman") hangmanModal(client,interaction,things[1],things[2])
        }

    },//? on(client,interaction)
}; //? const e:Event

export default e;