import { ActionRowBuilder, ApplicationCommandType, Attachment, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Command } from "../utils/class/Command";
import { createCanvas, loadImage } from "canvas";
import { join } from "path";
import { GameType, HangmanData, generateHangmanImage, generateId } from "../utils/class/types";
import { readFileSync } from "fs";
import t from "../utils/locale";

const c: Command = {
    name: 'adam-asmaca',
    description: 'Yeni bir adam asmaca oyunu başlat',
    cooldown: 3,
    permissions: [],
    requiredPermissions: [],
    async execute(client, interaction) {
         //* Rastgele kelime bulma
        /**
         * bütün kelimeler
         */
        const words = JSON.parse(readFileSync(join(process.cwd(),t('words',{locale:interaction.locale,namespace:'common'}))).toString()) as string[];
        /**
         * bütün kelimeler yani {@link words}ten çekilen bir kelime
         */
        const word = words[Math.round(Math.random()*words.length)];

        const newGameData:HangmanData = {
                lastFound:"?????",
                manStage:0,
                triedChars:[],
                word,
                foundChars:[]
        }
        const id = generateId();

        client.database.games.set(id,{player:interaction.user.id,type:GameType.Hangman,data:newGameData});

        interaction.reply({
            files:[
                new AttachmentBuilder(await generateHangmanImage(newGameData),{name:'hangman.png'})
            ],
            components:[
                new ActionRowBuilder<ButtonBuilder>({
                    components:[
                        new ButtonBuilder({
                            customId:`hangman###${id}###letter`,
                            label:t('button.hangman.guess.letter',{locale:interaction.locale}),
                            style:ButtonStyle.Primary
                        }),
                        new ButtonBuilder({
                            customId:`hangman###${id}###word`,
                            label:t('button.hangman.guess.word',{locale:interaction.locale}),
                            style:ButtonStyle.Secondary
                        }),
                        new ButtonBuilder({
                            customId:`hangman###${id}###stop`,
                            label:t('button.generic.stop',{locale:interaction.locale}),
                            style:ButtonStyle.Danger
                        })
                    ]
                })
            ]
        })
        
    },
    slashData: {
        name: 'adam-asmaca',
        description: 'Yeni bir adam asmaca oyunu başlat',
        type: ApplicationCommandType.ChatInput,
        dm_permission: false,
        name_localizations:{"en-US":'hang-man'},
        description_localizations:{"en-US":'Start a new hangman game'}
    }
};

export default c;