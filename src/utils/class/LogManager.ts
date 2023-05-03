import { Colors, Embed, EmbedBuilder, Guild, Snowflake, TextChannel } from "discord.js";
import { GameLog } from "./types";
import { join } from "path";
import { existsSync, lchown, readFileSync, rmSync, writeFileSync } from "fs";
import { Core } from "./Core";
import t from "../locale";

/**
 * Oyun loglarını yönetme modülü
 */
export class LogManager {
    /**
     * Bir sunucu için oyun logunu alır. Log dosyayı yoksa oluşturulur
     * @param id sunucunun idsi
     * @returns sunucunun bulunan logları
     */
    public static fetch(id:Snowflake):GameLog[]{
        const dir = join(process.cwd(),'database','logs',id+'.json');

        if(!existsSync(dir)){
            writeFileSync(dir,"[]");
            return this.fetch(id);
        }

        const file = readFileSync(dir,{encoding:'utf8'});
        
        return JSON.parse(file) as GameLog[];
    }

    /**
     * bir sunucunun loguna bir öğe ekler
     * @param client client işte
     * @param guild sunucu
     * @param log eklenecek log
     */
    public static async add(client:Core,guild:Guild,log:GameLog){
        const dir = join(process.cwd(),'database','logs',guild.id+'.json');
        const file = this.fetch(guild.id);

        const guildData = await client.database.guilds.fetch(guild.id);
        if(guildData.gameLogs!==""&&guildData.gameLogs!==undefined){
            const channel = guild.channels.cache.get(guildData.gameLogs) as TextChannel;
            if(channel)
            channel.send({
                embeds:[
                    new EmbedBuilder({
                        title:t('log.new',{locale:guild.preferredLocale}),
                        color:Colors.Blue,
                        description:`
                        ${t('log.who',{locale:guild.preferredLocale,parameters:[["player",log.player],["type",t(log.type,{locale:guild.preferredLocale,namespace:'game_type'})]]})} ${/*sekiz parantez nası bitişik kapanabiliyo lan*/""}
                        ${t('log.id',{locale:guild.preferredLocale,parameters:[["id",log.id]]})}
                        `
                    })
                ]
            })
            client.checkLevel(client.users.cache.get(log.player))
        }

        file.push(log);
        writeFileSync(dir,JSON.stringify(file,undefined,1));
    }

    /**
     * bir sunucunun logunu siler
     * @param id sunucunun idsi
     */
    public static delete(id:Snowflake):void{
        const dir = join(process.cwd(),'database','logs',id+'.json');

        rmSync(dir,{recursive:true});
    }

    /**
     * bir sunucunun loglarını JSON objesine çevirmeden verir
     * @param id sunucunun idsi
     * @returns sunucunun önceden logu varsa log yoksa `undefined` büyük ihtimal `null` da olabilir bilmiyorum
     */
    public static get(id:Snowflake):string{
        const dir = join(process.cwd(),'database','logs',id+'.json');
        return readFileSync(dir,{encoding:'utf8'});
    }
}