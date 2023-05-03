import { ClientEvents } from "discord.js";
import { Core } from "./Core";

export interface Event {
    key:keyof ClientEvents
    on?:(client:Core,...args:any[])=>void
    once?:(client:Core,...args:any[])=>void
}