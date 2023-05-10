import {  ApplicationCommandOptionType, ApplicationCommandType,  ChatInputCommandInteraction, Colors} from "discord.js";
import { Command } from "../utils/class/Command";
import { Core } from "../utils/class/Core";
import t from "../utils/locale"
import { LogManager } from "../utils/class/LogManager";
import { GameType, generateId } from "../utils/class/types";

const c: Command = {
    name: 'taş-kağıt-makas',
    description: 'Bot ile taş kağıt makas oyna',
    cooldown: 3,
    permissions: [],
    requiredPermissions: [],
    async execute(client: Core, interaction: ChatInputCommandInteraction) {
        const guess = interaction.options.getString('seçim') as 'taş' | 'kağıt' | 'makas';

        var real = ['taş', 'kağıt', 'makas'][(Math.round(Math.random() * 3)) - 1];
        while (real === guess || real === undefined) {
            real = ['taş', 'kağıt', 'makas'][(Math.round(Math.random() * 3)) - 1];
        }

        function wins(gs: string, rl: string) {
            if (gs === 'taş') return rl === 'makas';
            if (gs === 'kağıt') return rl === 'taş';
            if (gs === 'makas') return rl === 'kağıt';
        }
        const won = wins(guess, real);

        var color = won ? Colors.Green : Colors.Red;
        var title = won ? t('results.generic.won', { locale: interaction.locale }) : t('results.generic.lost', { locale: interaction.locale });

        interaction.reply({
            embeds: [
                {
                    title, color, description: `
                    ${t('rps.you', { locale: interaction.locale })} ${t('rps.' + guess, { locale: interaction.locale })}
                    ${t('rps.bot', { locale: interaction.locale })} ${t('rps.' + real, { locale: interaction.locale })}
                    `
                }
            ]
        });

        const db = await client.database.users.fetch(interaction.user.id);
        db.gamesPlayed += 1;

        if (won) {
            db.exp += 20;
            db.wins += 1;

            await client.database.users.getDatabase().set(interaction.user.id,db);
            LogManager.add(client, interaction.guild, {
                date: Math.round(new Date().getTime()),
                gotExp: 20,
                id: generateId(),
                player: interaction.user.id,
                type: GameType.RockPaperScissors,
                won
            });
        } else {
            db.exp += 5;
            db.loses += 1

            await client.database.users.getDatabase().set(interaction.user.id,db);
            LogManager.add(client, interaction.guild, {
                date: Math.round(new Date().getTime()),
                gotExp: 5,
                id: generateId(),
                player: interaction.user.id,
                type: GameType.RockPaperScissors,
                won
            });
        }
    },
    slashData: {
        name: 'taş-kağıt-makas',
        description: 'Bot ile taş kağıt makas oyna',
        type: ApplicationCommandType.ChatInput,
        dm_permission: false,
        name_localizations: { "en-US": 'rock-paper-scissors' },
        description_localizations: { "en-US": 'Play rock paper scissors with bot' },
        options: [
            {
                type: ApplicationCommandOptionType.String,
                required: true,
                name: 'seçim',
                description: 'Taş, kağıt, makas!',
                name_localizations:{"en-US":'item'},
                description_localizations:{"en-US":'Rock paper scissors!'},
                choices: [
                    { name: 'Taş', value: 'taş' ,name_localizations:{"en-US":'Rock'}},
                    { name: 'Kağıt', value: 'kağıt' ,name_localizations:{"en-US":'Paper'}},
                    { name: 'Makas', value: 'makas' ,name_localizations:{"en-US":'Scissors'}}
                ]
            }
        ]
    }
};

export default c;