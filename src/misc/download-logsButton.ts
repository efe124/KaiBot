import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { Core } from "../utils/class/Core";
import { join } from "path";
import { LogManager } from "../utils/class/LogManager";
import t from "../utils/locale";


export default async (client:Core,interaction:ButtonInteraction)=>{
    interaction.message.edit({
        components:[
            new ActionRowBuilder<ButtonBuilder>({
                components:[
                    new ButtonBuilder({
                        customId:'adfg',
                        disabled:true,
                        style:ButtonStyle.Success,
                        label:t('button.generic.yes',{locale:interaction.locale})
                    })
                ]
            })
        ]
    })

    const dir = join(process.cwd(),'database','logs',interaction.guildId+'.json');

    await interaction.reply({
        content:t('game-logs.download.here',{locale:interaction.locale}),
        files:[dir],
        ephemeral:true
    })
    LogManager.delete(interaction.guildId);
}