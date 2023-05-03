import { QuickDB } from "quick.db";
import { Interface } from "readline";

export class Database<T> {
    private db:QuickDB<T>;
    protected defaultData:T;

    constructor(db:QuickDB,key:string,defaultData:T){
        this.db = db.table(key)
        this.defaultData = defaultData;
    }

    public async fetch(id:string):Promise<T> {
        const db = await this.db.get(id);
        if(!db){
            this.db.set(id,this.defaultData);
            return this.fetch(id);
        } else return db;
    }

    public getDatabase():QuickDB<T>{
        return this.db;
    }
}