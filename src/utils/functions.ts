import { Collection, ColorResolvable, InteractionReplyOptions, ReplyOptions, Snowflake } from "discord.js";
import { Command } from "./class/Command";
import { Core } from "./class/Core";
import t, { TLocale } from "./locale";

/**
 * Listeyi "a,b ve c" şeklinde geri verir
 * @param list liste
 * @param locale çevrilecek dil
 * @returns üstte yazıyo
 */
export function seperateList(list:string[],locale:TLocale):string {
    if(list.length == 1) return list[0]
    if(list.length == 0) return "";

    const list2 = list.slice(0,list.length - 1)
    
    return `${list2.join(", ")} ${t("grammar.list.last",{locale:locale,namespace:"common"})} ${list.pop()}`
}

/**
 * Cooldown varmı yokmu kontrol eder
 * @param client client işte
 * @param userId kontrol edilcek kullanıcı
 * @param command kontrol edilcek komut
 * @returns varsa saniye olarak ne kadar kaldığı yoksa false 
 */
export function checkCooldown(client:Core,userId:Snowflake,command:Command):boolean | number {
    const cooldowns = client.cooldowns;
    
    if(!cooldowns.has(command.name)) cooldowns.set(command.name,new Collection())

    const now:number = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown ?? 3) * 1000

    if(timestamps.has(userId)){
        const expiration = timestamps.get(userId) + cooldownAmount
        if (now < expiration){
            return Math.round((expiration - now) / 1000)
        }

        return false
    } else {
        timestamps.set(userId,now)
        setTimeout(() => timestamps.delete(userId),cooldownAmount)
        return false
    }
}

export function embed(color:ColorResolvable,msg:string,ephemeral:boolean = false):InteractionReplyOptions{
    return {
        ephemeral,
        embeds:[
            {
                description:msg,
                color
            }
        ]
    } as InteractionReplyOptions
}