import { Locale } from "discord.js"

export type TLocale = Locale | "da" | "de" | "en-GB" | "en-US" | "es-ES" | "fr" | "hr" | "it" | "lt" | "hu" | "nl" | "no" | "pl" | "pt-BR" | "ro" | "fi" | "sv-SE" | "vi" | "tr" | "cs" | "el" | "bg" | "ru" | "uk" | "hi" | "th" | "zh-CN" | "ja" | "ko" | "zh-TW"

export type TNameSpace = "commands" | "permissions" | "common" | "locales" | "features" | "flags" | "game_type"

export type TOptions = {
    locale: TLocale
    namespace?: TNameSpace
    parameters?: TParameters
}

export type TParameters = [string,string][]

export default function t(key: string, options: TOptions): string {
    var file;
    try {
        file = require(`../../../locales/${options.locale}/${options.namespace ?? "commands"}.json`)
    } catch (e) {
        file = require(`../../../locales/en-US/${options.namespace ?? "commands"}.json`)
    }

    var message: string = file[key]
    if (message === undefined) return key


    if (options.parameters) {
        function controlParamUsages(param: string): void {
            if (message.includes(`{{${param}}}`)) message = message.replace(`{{${param}}}`, options.parameters.find(r=>r[0]===param)[1])
        }

        options.parameters.forEach(i=>{
            controlParamUsages(i[0])
        })
    }

    return message
}