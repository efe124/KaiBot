import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { Command } from "../utils/class/Command";
import { Core } from "../utils/class/Core";
import { readFileSync } from "fs";
import { join } from "path";
import { GameType, WordleData, generateId } from "../utils/class/types";
import { seperateList } from "../utils/functions";
import t from "../utils/locale";

const c: Command = {
    name: 'kelime',
    description: 'Yeni bir kelime oyunu başlat',
    cooldown: 3,
    permissions: [],
    requiredPermissions: [],
    execute(client:Core, interaction:ChatInputCommandInteraction) {
        //* Rastgele kelime bulma
        /**
         * bütün kelimeler
         */
        const words = JSON.parse(readFileSync(join(process.cwd(),t('words',{locale:interaction.locale,namespace:'common'}))).toString()) as string[];
        /**
         * bütün kelimeler yani {@link words}ten çekilen bir kelime
         */
        const word = words[Math.round(Math.random()*words.length)];

        //* Kelimeden oyun datası çıkarma ve kaydetme
        /**
         * Yeni oyun için bir default data
         */
        const newGame = {
            word,
            foundChars:{
                correct:[],
                includes:[],
                none:[]
            },
            triesLeft:5,
            lastFound:"?????",
            tries:{
                "1":null,
                "2":null,
                "3":null,
                "4":null,
                "5":null
            }
        } as WordleData;
        const id = generateId();

        client.database.games.set(id,{
            type:GameType.Wordle,
            data:newGame,
            player:interaction.user.id
        });

        //* Oyun datasına göre kullanıcıya devam etmesi için bişeyler verme




        interaction.reply({
            embeds:[
                new EmbedBuilder({
                    color:Colors.Blue,
                    title:t('wordle.title',{locale:interaction.locale}),
                    description:`
                        ${t('wordle.word',{locale:interaction.locale,parameters:[["word","?????"]]})}
                        ${t('wordle.includes',{locale:interaction.locale,parameters:[["letters",""]]})}
                        ${t('wordle.none',{locale:interaction.locale,parameters:[["letters",""]]})}

                        \\_\\_\\_\\_\\_
                        \\_\\_\\_\\_\\_
                        \\_\\_\\_\\_\\_
                        \\_\\_\\_\\_\\_
                        \\_\\_\\_\\_\\_
                        
                        ${t('wordle.goon',{locale:interaction.locale})}
                    `
                })
            ],
        components:[
            new ActionRowBuilder<ButtonBuilder>({
                components:[
                    new ButtonBuilder({customId:`wordle###${id}###newTry`,style:ButtonStyle.Primary,label:t('button.wordle.guess',{locale:interaction.locale})}), // bu idler button handlerda ayrılıcak aslında argüman veriyoruz gibi bişey
                    new ButtonBuilder({customId:`wordle###${id}###stop`,style:ButtonStyle.Danger,label:t('button.generic.stop',{locale:interaction.locale})})
                ]
            })
        ]
    });
    },
    slashData: {
        name: 'kelime',
        description: 'Yeni bir kelime oyunu başlat',
        type: ApplicationCommandType.ChatInput,
        dm_permission: false,
        name_localizations:{
            "en-US":'wordle'
        },
        description_localizations:{
            "en-US":'Start a new wordle game'
        }
    }
};

export default c;