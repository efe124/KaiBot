import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { Core } from "../utils/class/Core";
import { GameType, WordleData } from "../utils/class/types";
import { seperateList } from "../utils/functions";
import { readFileSync } from "fs";
import { join } from "path";
import { LogManager } from "../utils/class/LogManager";
import t from "../utils/locale";


export default async (client: Core, interaction: ModalSubmitInteraction, id: string) => {  //* id, modalın ID'sinden geliyor
    const words = JSON.parse(readFileSync(join(process.cwd(), t('words',{locale:interaction.locale,namespace:'common'}))).toString()) as string[];

    const db = (await client.database.games.get(id)).data as WordleData;
    const guess = interaction.fields.getTextInputValue("guess").toLocaleUpperCase(interaction.locale);
    const correct = db.word;

    if (!words.includes(guess)) return interaction.reply({ content: t('game.wordle.notword',{locale:interaction.locale}), ephemeral: true });

    if (guess === correct) foundWord(client, interaction, id);
    else if (db.triesLeft == 1) lastTry(client, interaction, id);
    else anyTry(client, interaction, id);

    interaction.deferUpdate({ fetchReply: false });
};

/**
 * son denemede çağır
 */
async function lastTry(client: Core, interaction: ModalSubmitInteraction, id: string) {
    const db = (await client.database.games.get(id)).data as WordleData;
    const guess = interaction.fields.getTextInputValue("guess").toLocaleUpperCase(interaction.locale);
    const correct = db.word;
    //#region updateCorrect
    let found = db.lastFound;
    const array = guess.split("");
    for (let i = 0; i < array.length; i++) {
        const element = array[i];

        if (db.lastFound[i] === "?") {
            if (correct[i] === element) {
                if (!db.foundChars.correct.includes(element))
                    db.foundChars.correct.push(element);
                var a = found.split("");
                a[i] = element;
                found = a.join("");
            }
        }

        if (correct.includes(element)) {
            if (!db.foundChars.includes.includes(element))
                db.foundChars.includes.push(element);
        } else {
            if (!db.foundChars.none.includes(element))
                db.foundChars.none.push(element);
        }
    }
    //#endregion

    db.lastFound = found;
    db.tries[(5 - db.triesLeft) + 1] = guess;
    db.triesLeft -= 1;

    var expToGet = 0;
    expToGet += db.foundChars.includes.length / 2; // doğru bulunan harfler
    expToGet += db.foundChars.correct.length * 1.2; // sırası doğru bulunan harfler 
    expToGet += db.foundChars.none.length / 4; // içermediği bulunan harfler
    expToGet += Math.round(Math.random() * 5); // şansa bağlı rastgele extra

    const results: string[] = [];
    results.push(`+${db.foundChars.correct.length * 1.2} | ${t('results.wordle.correct',{locale:interaction.locale,parameters:[["count",db.foundChars.correct.length+'']]})}`);
    results.push(`+${db.foundChars.includes.length / 2} | ${t('results.wordle.includes',{locale:interaction.locale,parameters:[["count",db.foundChars.includes.length+'']]})}`);
    results.push(`+${db.foundChars.none.length / 4} | ${t('results.wordle.none',{locale:interaction.locale,parameters:[["count",db.foundChars.none.length+'']]})}`);

    interaction.message.edit({
        embeds: [
            new EmbedBuilder({
                color: Colors.Red,
                title: t('results.generic.lost',{locale:interaction.locale}),
                description: `
                ${t('results.hangman.was',{locale:interaction.locale,parameters:[["word",correct]]})}
                ${t('results.wordle.incs',{locale:interaction.locale,parameters:[["list",seperateList(db.foundChars.includes, interaction.locale)]]})}
                ${t('results.wordle.nons',{locale:interaction.locale,parameters:[["list",seperateList(db.foundChars.none, interaction.locale)]]})}
                `,
                fields: [
                    {
                        name: t('results.wordle.tries',{locale:interaction.locale}), value: [
                            `${db.tries[1] ?? "\\_\\_\\_\\_\\_"}`, // _____ ama markdowna girmesin diye ters slaşlı
                            `${db.tries[2] ?? "\\_\\_\\_\\_\\_"}`,
                            `${db.tries[3] ?? "\\_\\_\\_\\_\\_"}`,
                            `${db.tries[4] ?? "\\_\\_\\_\\_\\_"}`,
                            `${db.tries[5] ?? "\\_\\_\\_\\_\\_"}`
                        ].join("\n")
                    },
                    {
                        name: t('game.results.title',{locale:interaction.locale}), value: [
                            ...results,
                            t('game.results.total',{locale:interaction.locale,parameters:[["money",expToGet+'']]})
                        ].join("\n")
                    }
                ]
            })
        ],
        components: []
    });

    client.database.games.delete(id);

    const userDb = await client.database.users.fetch(interaction.user.id);
    userDb.exp += expToGet;
    userDb.loses += 1;
    userDb.gamesPlayed += 1;
    client.database.users.getDatabase().set(interaction.user.id, userDb);


    const guildDb = await client.database.guilds.fetch(interaction.guildId);
    if(guildDb.gameLogs)
    LogManager.add(client,interaction.guild,{
        date:Math.round(Date.now()/1000),
        gotExp:expToGet,
        id,
        player:interaction.user.id,
        type:GameType.Wordle,
        won:false
    })
}

/**
 * 1-4. denemelerde çağır
 */
async function anyTry(client: Core, interaction: ModalSubmitInteraction, id: string) {
    const db = (await client.database.games.get(id)).data as WordleData;
    const guess = interaction.fields.getTextInputValue("guess").toLocaleUpperCase(interaction.locale);
    const correct = db.word;
    //#region updateCorrect
    let found = db.lastFound;
    const array = guess.split("");
    for (let i = 0; i < array.length; i++) {
        const element = array[i];

        if (db.lastFound[i] === "?") {
            if (correct[i] === element) {
                if (!db.foundChars.correct.includes(element))
                    db.foundChars.correct.push(element);
                var a = found.split("");
                a[i] = element;
                found = a.join("");
            }
        }

        if (correct.includes(element)) {
            if (!db.foundChars.includes.includes(element))
                db.foundChars.includes.push(element);
        } else {
            if (!db.foundChars.none.includes(element))
                db.foundChars.none.push(element);
        }
    }
    //#endregion

    // yenilenen datayı verme
    db.lastFound = found;
    db.tries[(5 - db.triesLeft) + 1] = guess;
    db.triesLeft -= 1;
    await client.database.games.set(id, { type: GameType.Wordle, data: db,player:interaction.user.id });
    interaction.message.edit(
        {
            embeds:[
                new EmbedBuilder({
                    color:Colors.Blue,
                    title:t('wordle.title',{locale:interaction.locale}),
                    description:`
                        ${t('wordle.word',{locale:interaction.locale,parameters:[["word",db.lastFound]]})}
                        ${t('wordle.includes',{locale:interaction.locale,parameters:[["letters",seperateList(db.foundChars.includes,interaction.locale)]]})}
                        ${t('wordle.none',{locale:interaction.locale,parameters:[["letters",seperateList(db.foundChars.none, interaction.locale)]]})}

                        ${db.tries[1] ?? "\\_\\_\\_\\_\\_"}
                        ${db.tries[2] ?? "\\_\\_\\_\\_\\_"}
                        ${db.tries[3] ?? "\\_\\_\\_\\_\\_"}
                        ${db.tries[4] ?? "\\_\\_\\_\\_\\_"}
                        ${db.tries[5] ?? "\\_\\_\\_\\_\\_"}
                        
                        ${t('wordle.goon',{locale:interaction.locale})}
                    `
                })
            ]
        },
    );
}

/**
 * kelime bulunduğunda çağır
 */
async function foundWord(client: Core, interaction: ModalSubmitInteraction, id: string) {
    const db = (await client.database.games.get(id)).data as WordleData;

    const guess = interaction.fields.getTextInputValue("guess").toLocaleUpperCase(interaction.locale);
    const correct = db.word;
    //#region updateCorrect
    let found = db.lastFound;
    const array = guess.split("");
    for (let i = 0; i < array.length; i++) {
        const element = array[i];

        if (db.lastFound[i] === "?") {
            if (correct[i] === element) {
                if (!db.foundChars.correct.includes(element))
                    db.foundChars.correct.push(element);
                var a = found.split("");
                a[i] = element;
                found = a.join("");
            }
        }

        if (correct.includes(element)) {
            if (!db.foundChars.includes.includes(element))
                db.foundChars.includes.push(element);
        } else {
            if (!db.foundChars.none.includes(element))
                db.foundChars.none.push(element);
        }
    }
    //#endregion
    db.lastFound = found;
    db.tries[(5 - db.triesLeft) + 1] = guess;
    db.triesLeft -= 1;

    var expToGet = 0;
    const r = Math.round(Math.random() * 5);
    expToGet += db.foundChars.includes.length / 2; // doğru bulunan harfler
    expToGet += db.foundChars.correct.length * 1.2; // sırası doğru bulunan harfler 
    expToGet += db.foundChars.none.length / 4; // içermediği bulunan harfler
    expToGet += r; // şansa bağlı rastgele extra
    expToGet += db.triesLeft * 3; // kaç denemede bulduğuna göre para
    const results: string[] = [];
    results.push(`+${db.foundChars.correct.length * 1.2} | ${t('results.wordle.correct',{locale:interaction.locale,parameters:[["count",db.foundChars.correct.length+'']]})}`);
    results.push(`+${db.foundChars.includes.length / 2} | ${t('results.wordle.includes',{locale:interaction.locale,parameters:[["count",db.foundChars.includes.length+'']]})}`);
    results.push(`+${db.foundChars.none.length / 4} | ${t('results.wordle.none',{locale:interaction.locale,parameters:[["count",db.foundChars.none.length+'']]})}`);
    results.push(`+${db.triesLeft * 3} | ${t('results.wordle.tleft',{locale:interaction.locale,parameters:[["tries",(5 - db.triesLeft)+'']]})}`);
    results.push(`+${r} | Extra`);


    interaction.message.edit({
        embeds:[
            new EmbedBuilder({
                color:Colors.Green,
                title:t('results.generic.won',{locale:interaction.locale}),
                description:t('results.hangman.was',{locale:interaction.locale}),
                fields:[
                    {name:t('results.wordle.tries',{locale:interaction.locale}),value:`
                    ${db.tries[1] ?? "\\_\\_\\_\\_\\_"}
                    ${db.tries[2] ?? "\\_\\_\\_\\_\\_"}
                    ${db.tries[3] ?? "\\_\\_\\_\\_\\_"}
                    ${db.tries[4] ?? "\\_\\_\\_\\_\\_"}
                    ${db.tries[5] ?? "\\_\\_\\_\\_\\_"}
                    `},
                    {
                        name: t('game.results.title',{locale:interaction.locale}), value: [
                            ...results,
                            t('game.results.total',{locale:interaction.locale,parameters:[["money",expToGet+'']]})
                        ].join("\n")
                    }
                ]
            })
        ],
        components: []
    });

    client.database.games.delete(id);

    const userDb = await client.database.users.fetch(interaction.user.id);
    userDb.exp += expToGet;
    userDb.gamesPlayed += 1;
    userDb.wins += 1;
    client.database.users.getDatabase().set(interaction.user.id, userDb);

    
    const guildDb = await client.database.guilds.fetch(interaction.guildId);
    if(guildDb.gameLogs)
    LogManager.add(client,interaction.guild,{
        date:Math.round(Date.now()/1000),
        gotExp:expToGet,
        id,
        player:interaction.user.id,
        type:GameType.Wordle,
        won:true
    })
}