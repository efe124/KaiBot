import { ButtonInteraction, Colors, EmbedBuilder } from "discord.js";
import { Core } from "../utils/class/Core";
import { FindTheXData, FindTheXGame, GameType } from "../utils/class/types";
import { LogManager } from "../utils/class/LogManager";
import t from "../utils/locale";

export default async (client: Core, interaction: ButtonInteraction, id: string, method: string) => {
    const db = await client.database.games.get(id);
    if (!db) return interaction.reply({ content: t('game.generic.done',{locale:interaction.locale}), ephemeral: true });
    if(db.player!==interaction.user.id) return interaction.reply({content:t('game.generic.notplayer',{locale:interaction.locale}),ephemeral:true})

    //* 'Bırak' butonu
    if (method === "stop") {
        await client.database.games.delete(id);

        await interaction.channel.fetch(); // bi ara kanalın cache'i yok o yüzden mesaj editlenemiyo diye bi hata gelmişti ondan
        const msg = interaction.message;

        msg.edit({
            components: [],
            embeds: [
                new EmbedBuilder({
                    title: t('game.stopped',{locale:interaction.locale}),
                    color:Colors.Red,
                    fields: [
                        { name: t('game.results.title',{locale:interaction.locale}), value: t('game.results.stopped',{locale:interaction.locale}) }
                    ]
                })
            ]
        });
    }
    //* 'Yukarı' butonu
    else if (method === "up") {
        const game = new FindTheXGame(db.data as FindTheXData);

        const playerPos = game.getPlayerPosition();
        if (playerPos[1] == 1) return interaction.reply({ content: t('game.x.up.cant',{locale:interaction.locale}), ephemeral: true }); // 
        const newPos = [playerPos[0], playerPos[1]];
        newPos[1] -= 1; // y azalıyo yani haritada bir yukarısı demek
        if (game.getBlock(newPos[0], newPos[1]) === "🟦") return interaction.reply({ content: t('game.x.up.block',{locale:interaction.locale}), ephemeral: true });
        if (game.getBlock(newPos[0], newPos[1]) === "❌") return foundX(client, interaction, id, game); // Oyuncu X'e gelmişse bu çalışıyo


        else { // burda artık yukarıya gitmeli
            game.setBlock(playerPos[0], playerPos[1], "⬛");
            game.setBlock(newPos[0], newPos[1], "😳");

            const data = game.toJSON();
            data.moves += 1;
            client.database.games.set(id, { type: GameType.FindTheX, data,player:interaction.user.id });
            interaction.message.edit({
                embeds: [
                    new EmbedBuilder({
                        color:Colors.Blue,
                        description: game.toString()
                    })
                ]
            });
        }
    }
    //* 'Aşağı' butonu
    else if (method === "down") {
        const game = new FindTheXGame(db.data as FindTheXData);

        const playerPos = game.getPlayerPosition();
        if (playerPos[1] == 8) return interaction.reply({ content: t('game.x.down.cant',{locale:interaction.locale}), ephemeral: true }); // 
        const newPos = [playerPos[0], playerPos[1]];
        newPos[1] += 1; //y bir artıyo yani haritada bir aşağısı demek
        if (game.getBlock(newPos[0], newPos[1]) === "🟦") return interaction.reply({ content: t('game.x.down.block',{locale:interaction.locale}), ephemeral: true });
        if (game.getBlock(newPos[0], newPos[1]) === "❌") return foundX(client, interaction, id, game); // Oyuncu X'e gelmişse bu çalışıyo

        else { // burda artık aşağıya inmeli
            game.setBlock(playerPos[0], playerPos[1], "⬛");
            game.setBlock(newPos[0], newPos[1], "😳");

            const data = game.toJSON();
            data.moves += 1;
            client.database.games.set(id, { type: GameType.FindTheX, data,player:interaction.user.id });
            interaction.message.edit({
                embeds: [
                    new EmbedBuilder({
                        color:Colors.Blue,
                        description: game.toString()
                    })
                ]
            });

        }
    }
    //* 'Sol' butonu
    else if (method === "left") {
        const game = new FindTheXGame(db.data as FindTheXData);

        const playerPos = game.getPlayerPosition();
        if (playerPos[0] == 1) return interaction.reply({ content: t('game.x.left.cant',{locale:interaction.locale}), ephemeral: true }); // 
        const newPos = [playerPos[0], playerPos[1]];
        newPos[0] -= 1; //x bir azalıyo yani haritada bir solu demek
        if (game.getBlock(newPos[0], newPos[1]) === "🟦") return interaction.reply({ content: t('game.x.left.block',{locale:interaction.locale}), ephemeral: true });
        if (game.getBlock(newPos[0], newPos[1]) === "❌") return foundX(client, interaction, id, game); // Oyuncu X'e gelmişse bu çalışıyo

        else { // burda artık aşağıya inmeli
            game.setBlock(playerPos[0], playerPos[1], "⬛");
            game.setBlock(newPos[0], newPos[1], "😳");

            const data = game.toJSON();
            data.moves += 1;
            client.database.games.set(id, { type: GameType.FindTheX, data,player:interaction.user.id });
            interaction.message.edit({
                embeds: [
                    new EmbedBuilder({
                        color:Colors.Blue,
                        description: game.toString()
                    })
                ]
            });

        }
    }
    //* 'Sağ' butonu
    else if (method === "right") {
        const game = new FindTheXGame(db.data as FindTheXData);

        const playerPos = game.getPlayerPosition();
        if (playerPos[0] == 8) return interaction.reply({ content: t('game.x.right.cant',{locale:interaction.locale}), ephemeral: true }); // 
        const newPos = [playerPos[0], playerPos[1]];
        newPos[0] += 1; //x bir artıyo yani haritada bir sağı demek
        if (game.getBlock(newPos[0], newPos[1]) === "🟦") return interaction.reply({ content: t('game.x.right.block',{locale:interaction.locale}), ephemeral: true });
        if (game.getBlock(newPos[0], newPos[1]) === "❌") return foundX(client, interaction, id, game); // Oyuncu X'e gelmişse bu çalışıyo

        else { // burda artık aşağıya inmeli
            game.setBlock(playerPos[0], playerPos[1], "⬛");
            game.setBlock(newPos[0], newPos[1], "😳");


            const data = game.toJSON();
            data.moves += 1;
            client.database.games.set(id, { type: GameType.FindTheX, data ,player:interaction.user.id});
            interaction.message.edit({
                embeds: [
                    new EmbedBuilder({
                        color:Colors.Blue,
                        description: game.toString()
                    })
                ]
            });

        }
    }

    interaction.deferUpdate({ fetchReply: false });
};

/**
 * oyuncu X'e gelince çağır 
 */
async function foundX(client: Core, interaction: ButtonInteraction, id: string, game: FindTheXGame) {
    game.setBlock(7, 8, "⬛");
    game.setBlock(7, 7, "⬛");
    game.setBlock(8, 7, "⬛");
    game.setBlock(8, 8, "😳");
    // oyuncuyu X'in etrafından silip oyuncuyu X'in oraya koyduk

    const data = game.toJSON();
    client.database.games.delete(id);
    // x bulundu ve sonuçlara geçiyoruz

    var expToGet = 0;
    const results: string[] = [];
    expToGet += (25 - data.moves) * 1.2;
    results.push(`+${(25 - data.moves) * 1.2} | ${t('results.x.step',{locale:interaction.locale,parameters:[["moves",data.moves+'']]})}`);

    expToGet -= (expToGet / 100) * (data.moves / 2); //Discord API'ye fazla request gönderme vergisi :D
    results.push(`-${(expToGet / 100) * (data.moves / 2)} | ${t('results.x.aut',{locale:interaction.locale})}`);

    interaction.message.edit({
        embeds:[
            new EmbedBuilder({
                color:Colors.Green,
                title:t('game.x.win.title',{locale:interaction.locale}),
                description:game.toString().replace("😳", "😁"),
                fields:[
                    {
                        name:t('game.results.title',{locale:interaction.locale}),
                        value:[
                            ...results,
                            t('game.results.total',{locale:interaction.locale,parameters:[["money",expToGet+'']]})
                        ].join("\n")
                    }
                ]
            })
        ],
        components: []
    });

    const userDb = await client.database.users.fetch(interaction.user.id);
    userDb.exp += expToGet;
    userDb.wins += 1;
    userDb.gamesPlayed += 1;
    await client.database.users.getDatabase().set(interaction.user.id, userDb);

 
    const guildDb = await client.database.guilds.fetch(interaction.guildId);
    if(guildDb.gameLogs)
    LogManager.add(client,interaction.guild,{
        date:Math.round(Date.now()/1000),
        gotExp:expToGet,
        id,
        player:interaction.user.id,
        type:GameType.FindTheX,
        won:true
    })
    client.checkLevel(interaction.user);
    interaction.deferUpdate();
}