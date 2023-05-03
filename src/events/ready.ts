import { Core } from "../utils/class/Core";
import { Event } from "../utils/class/Events";
import { registerCommands } from "../utils/handlers/commands";

const e:Event = {
    key:"ready",
    once(client:Core) {
        console.log("Ready!");
        registerCommands(client,"guild")
    },
}

export default e