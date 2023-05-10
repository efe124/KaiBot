import { AttachmentBuilder, Colors, ModalSubmitInteraction, Sticker } from "discord.js";
import { Core } from "../utils/class/Core";
import { GameType, HangmanData, generateHangmanImage, isLetter } from "../utils/class/types";
import { LogManager } from "../utils/class/LogManager";
import t from "../utils/locale";

export default async (client: Core, interaction: ModalSubmitInteraction, id: string, method: string) => {

    if (method === 'word') word(client, interaction, id);
    if (method === 'letter') letter(client, interaction, id);
};

async function letter(client: Core, interaction: ModalSubmitInteraction, id: string) {
    const db = await client.database.games.get(id);
    const data = db.data as HangmanData;
    const guess = interaction.fields.getTextInputValue("guess").toLocaleUpperCase(interaction.locale);

    if(!isLetter(guess)) return interaction.reply({content:t('game.hangman.notletter',{locale:interaction.locale}),ephemeral:true});
    if (data.foundChars.includes(guess) || data.triedChars.includes(guess)) return interaction.reply({ content: t('game.hangman.letter.already',{locale:interaction.locale}), ephemeral: true });

    if (data.word.includes(guess)) {
        data.foundChars.push(guess);


        let found = data.lastFound + "";
        const array = data.lastFound.split("");
        for (let i = 0; i < array.length; i++) {
            const element = array[i];

            if (element === "?") {
                if (data.foundChars.includes(data.word[i])) {
                    const a = found.split("");
                    a[i] = data.word[i];
                    found = a.join("");
                }
            }
        }
        if (found === data.word) {
            data.lastFound =data.word;
            return won(client, interaction, id, data);
        }
        data.lastFound = found;

        db.data = data;
        await client.database.games.set(id, db);
        interaction.message.edit({
            files: [
                new AttachmentBuilder(await generateHangmanImage(data), { name: 'hangman.png' })
            ]
        });


    } else {
        data.triedChars.push(guess);
        data.manStage += 1;
        if (data.manStage == 6) {
            data.triedChars = [];
            data.lastFound = data.word;
            return lost(client, interaction, id, data);
        }

        db.data = data;
        await client.database.games.set(id, db);
        interaction.message.edit({
            files: [
                new AttachmentBuilder(await generateHangmanImage(data), { name: 'hangman.png' })
            ]
        });
    }

    interaction.deferUpdate({ fetchReply: false });
}

async function word(client: Core, interaction: ModalSubmitInteraction, id: string) {
    const db = await client.database.games.get(id);
    const data = db.data as HangmanData;
    const guess = interaction.fields.getTextInputValue("guess").toLocaleUpperCase(interaction.locale);

    if(guess === data.word){
        data.lastFound = data.word;
        won(client,interaction,id,data);
    } else {
        data.lastFound = data.word;
        lost(client,interaction,id,data);
    }
}

async function lost(client: Core, interaction: ModalSubmitInteraction, id: string, data: HangmanData) {
    await client.database.games.delete(id);

    const results:string[] = [];
    var expToGet = 0;
    expToGet += data.foundChars.length*1.5; // doğru harfler
    expToGet += (data.triedChars.length+data.foundChars.length)*0.3 // denenen harfler
    results.push(`+${data.foundChars.length*1.5} | ${t('results.hangman.correct',{locale:interaction.locale,parameters:[["count",data.foundChars.length+'']]})}`)
    results.push(`+${(data.triedChars.length+data.foundChars.length)*0.3} | ${t('results.hangman.tried',{locale:interaction.locale,parameters:[["count",(data.triedChars.length+data.foundChars.length)+'']]})}`)

    interaction.message.edit({
        files: [
            new AttachmentBuilder(await generateHangmanImage(data), { name: 'hangman.png' })
        ],
        embeds:[
            {
                title:t('results.generic.lost',{locale:interaction.locale}),
                description:t('results.hangman.was',{locale:interaction.locale,parameters:[["word",data.word]]}),
                color:Colors.Red,
                fields:[
                    {
                        name:t('game.results.title',{locale:interaction.locale}),
                        value:[
                            ...results,
                             t('game.results.total',{locale:interaction.locale,parameters:[["money",expToGet+'']]})
                        ].join("\n")
                    }
                ]
            }
        ],
        components:[]
    });

    interaction.deferUpdate({fetchReply:false})

    const userDb = await client.database.users.fetch(interaction.user.id);
    userDb.gamesPlayed += 1;
    userDb.loses += 1;
    userDb.exp += expToGet;

    const guildDb = await client.database.guilds.fetch(interaction.guildId);
    if(guildDb.gameLogs)
    LogManager.add(client,interaction.guild,{
        date:Math.round(Date.now()/1000),
        gotExp:expToGet,
        id,
        player:interaction.user.id,
        type:GameType.Hangman,
        won:false
    })
}

async function won(client: Core, interaction: ModalSubmitInteraction, id: string, data: HangmanData) {
    await client.database.games.delete(id);

    const results:string[] = [];
    var expToGet = 5; // kelime bulunduğundan 5 ile başlıyor direk
    expToGet += data.foundChars.length*1.5; // doğru harfler
    expToGet += data.triedChars.length*0.3 // denenen harfler
    results.push(`+${data.foundChars.length*1.5} | ${t('results.hangman.correct',{locale:interaction.locale,parameters:[["count",data.foundChars.length+'']]})}`)
    results.push(`+${(data.triedChars.length+data.triedChars.length)*0.3} | ${t('results.hangman.tried',{locale:interaction.locale,parameters:[["count",(data.triedChars.length+data.triedChars.length)+'']]})}`)
    results.push(`+5 | ${t('results.hangman.found',{locale:interaction.locale})}`)

    interaction.message.edit({
        files: [
            new AttachmentBuilder(await generateHangmanImage(data), { name: 'hangman.png' })
        ],
        embeds:[
            {
                title:t('results.generic.won',{locale:interaction.locale}),
                description:t('results.hangman.was',{locale:interaction.locale,parameters:[["word",data.word]]}),
                color:Colors.Green,
                fields:[
                    {
                        name:t('game.results.title',{locale:interaction.locale}),
                        value:[
                            ...results,
                             t('game.results.total',{locale:interaction.locale,parameters:[["money",expToGet+'']]})
                        ].join("\n")
                    }
                ]
            }
        ],
        components:[]
    });

    interaction.deferUpdate({fetchReply:false})

    const userDb = await client.database.users.fetch(interaction.user.id);
    userDb.gamesPlayed += 1;
    userDb.wins += 1;
    userDb.exp += expToGet;

    const guildDb = await client.database.guilds.fetch(interaction.guildId);
    if(guildDb.gameLogs)
    LogManager.add(client,interaction.guild,{
        date:Math.round(Date.now()/1000),
        gotExp:expToGet,
        id,
        player:interaction.user.id,
        type:GameType.Hangman,
        won:true
    })
}