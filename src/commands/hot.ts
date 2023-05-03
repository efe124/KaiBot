import { ApplicationCommandOptionType, ApplicationCommandType,ChatInputCommandInteraction, Colors } from "discord.js";
import { Command } from "../utils/class/Command";
import {Core} from "../utils/class/Core";
import t from "../utils/locale";
import { LogManager } from "../utils/class/LogManager";
import { GameType, generateId } from "../utils/class/types";

const c: Command = {
    name: 'yazı-tura',
    description: 'Yazı tura oyna',
    cooldown: 3,
    permissions: [],
    requiredPermissions: [],
    async execute(client:Core, interaction:ChatInputCommandInteraction) {
        const guess = interaction.options.getString('tahmin') as 'yazı'|'tura';

        const real = ['yazı','tura','dik'][(Math.round(Math.random()*3))-1];
        const won = guess === real

        var color = won?Colors.Green:Colors.Red
        var title = won?t('results.generic.won',{locale:interaction.locale}):t('results.generic.lost',{locale:interaction.locale})

        interaction.reply({
            embeds:[
                {
                    title,color,description:`
                    ${t('game.hangman.modal.guess',{locale:interaction.locale})}: ${t('hot.'+guess,{locale:interaction.locale})}
                    ${t('hot.real',{locale:interaction.locale})} ${t('hot.'+real,{locale:interaction.locale})}
                    `
                }
            ]
        })

        const db = await client.database.users.fetch(interaction.user.id);
        db.gamesPlayed += 1;

        if (won) {
            db.exp += 10;
            db.wins += 1;

            await client.database.users.getDatabase().set(interaction.user.id,db);
            LogManager.add(client, interaction.guild, {
                date: Math.round(new Date().getTime()),
                gotExp: 20,
                id: generateId(),
                player: interaction.user.id,
                type: GameType.Coinflip,
                won
            });
        } else {
            db.exp += 2;
            db.loses += 1

            await client.database.users.getDatabase().set(interaction.user.id,db);
            LogManager.add(client, interaction.guild, {
                date: Math.round(new Date().getTime()),
                gotExp: 5,
                id: generateId(),
                player: interaction.user.id,
                type: GameType.Coinflip,
                won
            });
        }
    },
    slashData: {
        name: 'yazı-tura',
        description: 'Yazı tura oyna',
        name_localizations:{"en-US":'coin-flip'},
        description_localizations:{"en-US":'Flip a coin'},
        type: ApplicationCommandType.ChatInput,
        dm_permission: false,
        options:[
            {
                type:ApplicationCommandOptionType.String,
                name:'tahmin',
                description:'Yazımı turamı?',
                name_localizations:{"en-US":'guess'},
                description_localizations:{"en-US":'Heads or tails?'},
                choices:[
                    {name:'Yazı',value:'yazı',name_localizations:{"en-US":'Heads'}},
                    {name:'Tura',value:'tura',name_localizations:{"en-US":'Tails'}},
                ],
                required:true
            }
        ]
    }
};

export default c;