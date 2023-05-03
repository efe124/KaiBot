import { readdirSync } from "fs";
import { join } from "path";
import { Core } from "../class/Core";
import { Event } from "../class/Events";

const eventsdir = join(process.cwd(), "dist", "events");

export default function loadEvents(client: Core) {
    const eventFiles = readdirSync(eventsdir).filter(r => r.endsWith(".js"));

    eventFiles.forEach(async (file) => {
        const event = await import(`${eventsdir}/${file}`).then(r => r.default) as Event;

        if(event.on){
            client.on(event.key,(...args)=>{event.on(client,...args)})
        }
        if(event.once){
            client.once(event.key,(...args)=>{event.once(client,...args)})
        }
    });
}