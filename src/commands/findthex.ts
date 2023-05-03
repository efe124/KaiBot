import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { Command } from "../utils/class/Command";
import { FindTheXGame, GameType, generateId, generateMap } from "../utils/class/types";
import t from "../utils/locale";

const c: Command = {
    name: 'x-i-bul',
    description: 'Yeni bir "X\'i bul" oyunu başlat',
    cooldown: 3,
    permissions: [],
    requiredPermissions: [],
    execute(client, interaction) {
        const id = generateId();
        const game = new FindTheXGame({
            map: generateMap(),
            moves: 0,
            player: [1, 1],
            x: [8, 8]
        });

        client.database.games.set(id, {
            type: GameType.FindTheX,
            data: game.toJSON(),
            player: interaction.user.id
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder({
                    description: game.toString()
                })
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>({
                    components: [
                        new ButtonBuilder({
                            customId: `findthex###${id}###left`,
                            label: "⬅️",
                            style: ButtonStyle.Primary
                        }),
                        new ButtonBuilder({
                            customId: `findthex###${id}###up`,
                            label: "⬆️",
                            style: ButtonStyle.Primary
                        }),
                        new ButtonBuilder({
                            customId: `findthex###${id}###down`,
                            label: "⬇️",
                            style: ButtonStyle.Primary
                        }),
                        new ButtonBuilder({
                            customId: `findthex###${id}###right`,
                            label: "➡️",
                            style: ButtonStyle.Primary
                        }),
                        new ButtonBuilder({
                            customId: `findthex###${id}###stop`,
                            label: t('button.generic.stop',{locale:interaction.locale}),
                            style: ButtonStyle.Danger
                        })
                    ]
                })
            ]
        });


    },
    slashData: {
        name: 'x-i-bul',
        name_localizations:{
            "en-US":"find-the-x"
        },
        description: 'Yeni bir "X\'i bul" oyunu başlat',
        type: ApplicationCommandType.ChatInput,
        dm_permission: false,
        description_localizations:{
            "en-US":'Start a new "Find the X" game'
        }
    }
};

export default c;