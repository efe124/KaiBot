import { ActionRowBuilder, AttachmentBuilder, ButtonInteraction, Colors, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Core } from "../utils/class/Core";
import { HangmanData, generateHangmanImage } from "../utils/class/types";
import t from "../utils/locale";

export default async (client: Core, interaction: ButtonInteraction, id: string, method: string) => {
    const db = await client.database.games.get(id);
    if (!db) return interaction.reply({ content: t('game.generic.done',{locale:interaction.locale}), ephemeral: true });
    if (db.player !== interaction.user.id) return interaction.reply({ content: t('game.generic.notplayer',{locale:interaction.locale}), ephemeral: true });

    //* 'Bırak' butonu
    if (method === 'stop') {
        const data = (await client.database.games.get(id)).data as HangmanData;
        await client.database.games.delete(id);

        data.lastFound = data.word;

        interaction.deferUpdate({ fetchReply: false });
        interaction.message.edit({
            files: [
                new AttachmentBuilder(await generateHangmanImage(data), { name: 'hangman.png' })
            ],
            components: [],
            embeds: [
                {
                    title: t('game.results.title',{locale:interaction.locale}),
                    description: t('game.results.stopped',{locale:interaction.locale}),
                    color: Colors.Red
                }
            ]
        });
    }
    //* 'Harf Tahmini' butonu
    else if (method === 'letter') {
        const modal = new ModalBuilder({
            title: t('button.hangman.guess.letter',{locale:interaction.locale}),
            customId: `hangman###${id}###letter`,
            components: [
                new ActionRowBuilder<TextInputBuilder>({
                    components: [
                        {
                            customId: 'guess',
                            type: ComponentType.TextInput,
                            style: TextInputStyle.Short,
                            label: t('game.hangman.modal.guess',{locale:interaction.locale}),
                            placeholder: t('game.hangman.modal.placeholder.letter',{locale:interaction.locale}),
                            maxLength: 1,
                            minLength: 1,
                            required: true
                        }
                    ]
                })
            ]
        });


        interaction.showModal(modal);
    }
    //* 'Kelime Tahmini' butonu
    else if (method === 'word') {
        const modal = new ModalBuilder({
            title: t('button.hangman.guess.word',{locale:interaction.locale}),
            customId: `hangman###${id}###word`,
            components: [
                new ActionRowBuilder<TextInputBuilder>({
                    components: [
                        {
                            customId: 'guess',
                            type: ComponentType.TextInput,
                            style: TextInputStyle.Short,
                            label: t('game.hangman.modal.guess',{locale:interaction.locale}),
                            placeholder: t('game.hangman.modal.placeholder.word',{locale:interaction.locale}),
                            maxLength: 5,
                            minLength: 5,
                            required: true
                        }
                    ]
                })
            ]
        });


        interaction.showModal(modal);
    }
};