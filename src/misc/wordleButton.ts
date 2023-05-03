import { ActionRow, ActionRowBuilder, ButtonInteraction, Colors, ComponentType, EmbedBuilder, ModalBuilder, TextInputComponent, TextInputStyle } from "discord.js";
import { Core } from "../utils/class/Core";
import { WordleData } from "../utils/class/types";
import t from "../utils/locale";

export default async (client: Core, interaction: ButtonInteraction, id: string, method: string) => { //* id:string ve method:string, butonun ID'sindeki "${id}###${method}" kısmından geliyor.
    const db = await client.database.games.get(id);
    if (!db) return interaction.reply({ content: t('game.generic.done',{locale:interaction.locale}), ephemeral: true });
    if(db.player!==interaction.user.id) return interaction.reply({content:t('game.generic.notplayer',{locale:interaction.locale}),ephemeral:true})

    //* 'Bırak' butonu
    if (method === "stop") {
        /**
         * Oyunla alakalı son birkaç veri için oyunu veri tabanından silmeden önce çekiyoruz. Buda çekilen şey
         */
        const data = db.data as WordleData;
        await client.database.games.delete(id);

        await interaction.channel.fetch();
        const msg = interaction.message;

        msg.edit({
            components:[],
            embeds:[
                new EmbedBuilder({
                    color:Colors.Red,
                    title:t('game.stopped',{locale:interaction.locale}),
                    description:t('results.hangman.was',{locale:interaction.locale,parameters:[["word",data.word]]}),
                    fields:[
                        {name:t('game.results.title',{locale:interaction.locale}),value:t('game.results.stopped',{locale:interaction.locale})}
                    ]
                })
            ]
        });
    }
    //* 'Tahmin Et' butonu
    else if (method === "newTry") {
        /**
         * kullanıcıya gönderilecek modal
         */
        const modal = new ModalBuilder({
            title:t('game.wordle.modal.title',{locale:interaction.locale}),
            customId:`wordle###${id}`,
            components:[
                {
                    type:ComponentType.ActionRow,
                    components:[
                        {
                            style:TextInputStyle.Short,
                            minLength:5,
                            maxLength:5,
                            customId:"guess",
                            placeholder:t('game.wordle.modal.placeholder.guess',{locale:interaction.locale}),
                            label:t('game.hangman.modal.guess',{locale:interaction.locale}),
                            type:ComponentType.TextInput,
                            required:true
                        }
                    ]
                }
            ]
        });

        interaction.showModal(modal); // modalın hem kod hemde kullanımda message collector'dan daha kullanışlı olduğunu düşündüm

    } //? else if(method === newTry)
}; //? export default async