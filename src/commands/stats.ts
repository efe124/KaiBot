import { ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { Command } from "../utils/class/Command";
import t from "../utils/locale";

const c: Command = {
    name: 'istatistikler',
    description: 'İstatistiklerini gör',
    cooldown: 3,
    permissions: [],
    requiredPermissions: [],
    async execute(client, interaction) {
       const userDb = await client.database.users.fetch(interaction.user.id);

        interaction.reply({
            embeds:[
                new EmbedBuilder({
                    color:Colors.White,
                    title:t('stats.title',{locale:interaction.locale,parameters:[
                        ["user",interaction.user.username],
                        ["disc",interaction.user.discriminator]
                    ]}),
                    description:`
                        ${t('stats.money',{locale:interaction.locale,parameters:[["money",userDb.exp+'']]})}
                        ${t('stats.level',{locale:interaction.locale,parameters:[["level",userDb.level+'']]})}
                        ${t('stats.rank',{locale:interaction.locale,parameters:[["rank",t(`rank.${userDb.rank}`,{locale:interaction.locale,namespace:'common'})]]})}

                        ${t('stats.games',{locale:interaction.locale,parameters:[["games",userDb.gamesPlayed+'']]})}
                        ${t('stats.wins',{locale:interaction.locale,parameters:[["wins",userDb.wins+'']]})}
                        ${t('stats.loses',{locale:interaction.locale,parameters:[["loses",userDb.loses+'']]})}
                    `
                })
            ]
        })

    },
    slashData: {
        name: 'istatistikler',
        description: 'İstatistiklerini gör',
        type: ApplicationCommandType.ChatInput,
        dm_permission: false,
        name_localizations:{"en-US":'stats'},
        description_localizations:{"en-US":'See your stats'}
    }
};

export default c;