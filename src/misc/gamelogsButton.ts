import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors } from "discord.js";
import { Core } from "../utils/class/Core";
import { LogManager } from "../utils/class/LogManager";
import { embed } from "../utils/functions";
import t from "../utils/locale";

export default async (client:Core,interaction:ButtonInteraction)=>{
    interaction.message.edit({
        components:[
            new ActionRowBuilder<ButtonBuilder>({
                components:[
                    new ButtonBuilder({
                        style:ButtonStyle.Success,
                        customId:'gamelogsclear',
                        label:t('button.generic.yes',{locale:interaction.locale}),
                        disabled:true
                    })
                ]
            })
        ]
    })

    await LogManager.delete(interaction.guildId);
    interaction.reply(embed(Colors.Green,t('game-logs.clear.done',{locale:interaction.locale})));
}