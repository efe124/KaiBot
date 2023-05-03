import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionsBitField } from "discord.js";
import { Command } from "../utils/class/Command";
import { Core } from "../utils/class/Core";
import { embed } from "../utils/functions";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { GameLog } from "../utils/class/types";
import { LogManager } from "../utils/class/LogManager";
import t from "../utils/locale";

const c: Command = {
    name: 'oyun-logları',
    description: 'Oyun loglarını yönet',
    cooldown: 3,
    permissions: ["ManageGuild","ManageChannels"],
    requiredPermissions: [],
    async execute(client: Core, interaction: ChatInputCommandInteraction) {
        const option = interaction.options.getSubcommand();

        if(option==='incele')see(client,interaction);
        if(option==='kanal')set(client,interaction);
        if(option==='indir')download(client,interaction);
        if(option==='temizle')clear(client,interaction);
    },
    slashData: {
        name: 'oyun-logları',
        description: 'Oyun loglarını yönet',
        name_localizations:{
            "en-US":"game-logs"
        },
        description_localizations:{
            "en-US":"Manage game logs"
        },
        type: ApplicationCommandType.ChatInput,
        dm_permission: false,
        default_member_permissions: new PermissionsBitField(["ManageGuild", "ManageChannels"]).bitfield + "",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: 'kanal',
                description: 'Oyun logları kanalını belirle',
                name_localizations:{
                    "en-US":'channel'
                },
                description_localizations:{
                    "en-US":'Set a game logs channel'
                },
                options: [
                    {
                        type: ApplicationCommandOptionType.Channel,
                        name: 'kanal',
                        name_localizations:{
                            "en-US":'channel'
                        },
                        description_localizations:{
                            "en-US":'A channel to send game logs there. You can disable this system by leaving empty'
                        },
                        description: 'Oyun loglarının atılacağı kanal. boş bırakarak log sistemini kapatabilirsin',
                        required: false,
                        channel_types: [ChannelType.GuildText]
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: 'indir',
                description: 'Oyun loglarını indir ve sıfırla',
                name_localizations:{"en-US":'download'},
                description_localizations:{"en-US":'Download and clear game logs'}
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: 'incele',
                description: 'ID\'sini bildiğin bir oyun kaydını incele',
                name_localizations:{"en-US":'inspect'},
                description_localizations:{"en-US":'Inspect a game\'s log with it\'s ID'},
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: 'id',
                        required: true,
                        description: 'İncelenecek oyunun ID\'si',
                        description_localizations:{"en-US":'ID of the game log you want to inspect'}
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: 'temizle',
                description: 'Bu sunucuya ait oyun kayıtlarını temizle',
                name_localizations:{"en-US":'clear'},
                description_localizations:{"en-US":'Clear the game logs of this guild'}
            }
        ]
    }
};

async function see(client: Core, interaction: ChatInputCommandInteraction) {
    const guildDb = await client.database.guilds.fetch(interaction.guildId);
    if (!guildDb) return interaction.reply(embed(Colors.Red, t("game-logs.generic.notenabled",{locale:interaction.locale})));
    const id = interaction.options.getString("id", true);

    const dir = join(process.cwd(), 'database', 'logs', interaction.guildId + '.json');
    if (!existsSync(dir)) return interaction.reply(embed(Colors.Red, t("game-logs.see.notany",{locale:interaction.locale})));

    const logs = JSON.parse(readFileSync(dir).toString()) as GameLog[];
    const log = logs.find(r => r.id === id);

    if (!log) return interaction.reply(embed(Colors.Red, t('game-logs.see.notfound',{locale:interaction.locale,parameters:[["id",id]]})));

    interaction.reply({
        embeds: [
            {
                title: t('game-logs.see.title',{locale:interaction.locale,parameters:[["id",id]]}),
                description: `
                    ${t('game-logs.see.date',{locale:interaction.locale,parameters:[["date",log.date+""]]})}
                    ${t('game-logs.see.money',{locale:interaction.locale,parameters:[["money",log.gotExp+""]]})}
                    ${t('game-logs.see.player',{locale:interaction.locale,parameters:[["player",log.player+""]]})}
                    ${t('game-logs.see.type',{locale:interaction.locale,parameters:[["type",t(log.type,{locale:interaction.locale,namespace:'game_type'})]]})}


                    ${log.won ? t('game-logs.see.won',{locale:interaction.locale}) : t('game-logs.see.lost',{locale:interaction.locale})}
                    `
            }
        ],
        ephemeral: true
    });
}

async function set(client: Core, interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('kanal', false, [ChannelType.GuildText]); // bunlar kanalın text channel olduğunu anlamaya yetiyomuş lan 2 saat uğraşıyodum mal gibi
    const guildDb = await client.database.guilds.fetch(interaction.guildId);

    if (channel) {
        guildDb.gameLogs = channel.id;
        client.database.guilds.getDatabase().set(interaction.guildId, guildDb);

        interaction.reply(embed(Colors.Green, t('game-logs.set',{locale:interaction.locale,parameters:[["channel",channel.id]]})));
    } else {
        guildDb.gameLogs = null;
        client.database.guilds.getDatabase().set(interaction.guildId, guildDb);
        interaction.reply(embed(Colors.Green, t('game-logs.stopped',{locale:interaction.locale})));
    }
}

async function download(client: Core, interaction: ChatInputCommandInteraction) {
    const db = await client.database.guilds.fetch(interaction.guildId);
    if (!db.gameLogs) return interaction.reply(embed(Colors.Red, t('game-logs.generic.notenabled',{locale:interaction.locale})));
    if (!existsSync(join(process.cwd(), 'database', 'logs', interaction.guildId+'.json'))) return interaction.reply(embed(Colors.Red, t('game-logs.see.notany',{locale:interaction.locale})));

    interaction.reply({
        embeds: [
            new EmbedBuilder({
                title: t('game-logs.download.warning.title',{locale:interaction.locale}),
                color: Colors.Red,
                description: t('game-logs.download.warning',{locale:interaction.locale})
            })
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>({
                components: [
                    new ButtonBuilder({
                        customId: 'downloadlogs###confirm',
                        label: t('button.generic.yes',{locale:interaction.locale}),
                        style: ButtonStyle.Success
                    })
                ]
            })
        ]
    });
}

async function clear(client: Core, interaction: ChatInputCommandInteraction) {
    const db = await client.database.guilds.fetch(interaction.guildId);
    if (!db.gameLogs) return interaction.reply(embed(Colors.Red, t('game-logs.generic.notenabled',{locale:interaction.locale})));
    if (!existsSync(join(process.cwd(), 'database', 'logs', interaction.guildId+'.json'))) return interaction.reply(embed(Colors.Red, t('game-logs.see.notany',{locale:interaction.locale})));


    interaction.reply({
        embeds: [
            {
                description: t('game-logs.clear.sure',{locale:interaction.locale}),
                color: Colors.Red
            }
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>({
                components: [
                    new ButtonBuilder({
                        style: ButtonStyle.Success,
                        customId: 'gamelogsclear',
                        label: t('button.generic.yes',{locale:interaction.locale})
                    })
                ]
            })
        ]
    });
}

export default c;