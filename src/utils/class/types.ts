import { RPCErrorCodes, Snowflake } from "discord.js";
import { readFileSync } from "fs";
import { type } from "os";
import { join } from "path";
import {createCanvas,loadImage,Canvas} from "canvas";

/**
 * Kullanıcının veri tabanına kaydedilen datanın şeması
 */
export interface UserSchema {
    exp: number;
    level:number;
    wins: number;
    loses: number;
    gamesPlayed: number;
    rank:RankResolvable
}

/**
 * Oyun datasının mümkün türleri
 */
export enum GameType { Wordle = "wordle", FindTheX = "find_thex", Hangman = "hangman",Coinflip="hot",RockPaperScissors="rps" }

/**
 * Veri tabanına kaydedilen oyun şeması
 */
export interface GameData {
    type?: GameType,
    player: Snowflake;
    data?: WordleData | FindTheXData | HangmanData;
}

/**
 * Kelime bulma oyunu datası
 */
export interface WordleData {
    word: string;
    foundChars: {
        correct: string[];
        includes: string[];
        none: string[];
    };
    triesLeft: number;
    tries: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
    };
    lastFound: string;
}

/**
 * array'in içinden rastgele bir nesneyi verir
 * @param array 
 * @returns array'in içerdiği nesnelerden biri
 */
export function getRandomInArray<T>(array: T[]): T {
    return array[Math.round(Math.random() * array.length)];
}

/**
 * Oluşan ID'lede olabilcek karakterler
 */
const letters = "qwertyuopasdfghjkizxcvbnmQWERTYUIOPASDFHJKLZXCVBNM1234657890".split("");
/**
 * @returns Oyunlar için kullanılabilecek rastgele bir ID
 */
export function generateId(): string {
    let last = "";

    for (let i = 0; i < 10; i++) {
        last = last + getRandomInArray(letters);
    }

    return last;
}

/**
 * Find The X'de olabilecek bloklar
 */
export type FindTheXBlock = "🟦" | "😳" | "❌" | "⬛";
/**
 * Find The X'in 8x8 haritasındaki 8 adet y kordinatı içindeki x leri böyle kaydediyor. (mesela y:2,x:3 dediğimiz zaman haritadaki 2. FindTheXMapRow bulunuyor, ve 3. objesi veriliyor)
 */
export type FindTheXMapRow = [FindTheXBlock, FindTheXBlock, FindTheXBlock, FindTheXBlock, FindTheXBlock, FindTheXBlock, FindTheXBlock, FindTheXBlock];
/**
 * Find The X haritası 8 adet y kordinatını böyle kaydediyor. 
 */
export type FindTheXMapData = [FindTheXMapRow, FindTheXMapRow, FindTheXMapRow, FindTheXMapRow, FindTheXMapRow, FindTheXMapRow, FindTheXMapRow, FindTheXMapRow];

/**
 * Oyunun veri tabanına yansıyan datası
 */
export interface FindTheXData {
    map: FindTheXMapData;
    moves: number;
    x: [number, number];
    player: [number, number];
}

/**
 * Oyun kordinatlarının ne olacağını typescript'e ve yanmak istemeyen beynimize bildirmek için
 */
export type Coordinate = [number, number];

/**
 * Oyunun kendisini ve haritasını daha kolay yönetmek için kullanılan class. İçinde özel bir veri tutmuyor. aynı datayı yönetmek için her seferinde `new FindTheXGame(<data>)` yapılabilir.
 */
export class FindTheXGame {
    private data: FindTheXData;

    constructor(data: FindTheXData) {
        this.data = data;
    }

    /**
     * Bir bloğu haritadan bulur ve verir
     * @param x bloğun x'i
     * @param y bloğun y'si
     * @returns Bloğun ne olduğu
     */
    public getBlock(x: number, y: number): FindTheXBlock {
        return this.data.map[y - 1][x - 1];
    }

    /**
     * Bir bloğu değiştirir
     * @param x bloğun x'i
     * @param y bloğun y'si
     * @param block yeni blok
     */
    public setBlock(x: number, y: number, block: FindTheXBlock): void {
        this.data.map[y - 1][x - 1] = block;
    }

    /**
     * @returns Oyuncunun pozisyonu 
     */
    public getPlayerPosition(): Coordinate {
        const y = this.data.map.findIndex(r => r.includes("😳")) + 1; //rowlardan oyuncuyu içerenin bulunduğu rowun sayısı. 'Kod Sıfırdan Başlanır' zımbırtılarını gidermek için +1 verildi
        const x = this.data.map.find(r => r.includes("😳")).findIndex(r => r === "😳") + 1; //rowlardan oyuncuyu içeren row oyuncuyu hangi indexte içeriyosa o

        // vermeden önce datayada kaydetme
        this.data.player = [x, y];

        return [x, y];
    }

    /**
     * @returns X'in pozisyonu
     */
    public getXPosition(): Coordinate {
        const y = this.data.map.findIndex(r => r.includes("❌")) + 1; //rowlardan x'i içerenin bulunduğu rowun sayısı. 'Kod Sıfırdan Başlanır' zımbırtılarını gidermek için +1 verildi
        const x = this.data.map.find(r => r.includes("❌")).findIndex(r => r === "❌") + 1; //rowlardan x'i içeren row oyuncuyu hangi indexte içeriyosa o
        return [x, y];
    }

    /**
     * @returns Oyunun haritasının görsel hali
     */
    public toString(): string {
        return this.data.map.map(r => r.join("")).join("\n");
    }

    /**
     * @returns veri tabanına kaydederken kullanılması 
     */
    public toJSON(): FindTheXData {
        return this.data;
    }
}

export function generateMap(): FindTheXMapData {
    var items = JSON.parse(readFileSync(join(process.cwd(), "items.json")).toString()) as FindTheXBlock[];
    function a() {
        var random = Math.round(Math.random() * (items.length - 1));
        var r = items[random];
        if (r === undefined) return a();
        delete items[random];
        items = items.filter(r => r !== null);
        return r;
    }

    const list: FindTheXMapData = [
        [a(), a(), a(), a(), a(), a(), a(), a()],
        [a(), a(), a(), a(), a(), a(), a(), a()],
        [a(), a(), a(), a(), a(), a(), a(), a()],
        [a(), a(), a(), a(), a(), a(), a(), a()],
        [a(), a(), a(), a(), a(), a(), a(), a()],
        [a(), a(), a(), a(), a(), a(), a(), a()],
        [a(), a(), a(), a(), a(), a(), a(), a()],
        [a(), a(), a(), a(), a(), a(), a(), a()]
    ];

    const map = new FindTheXGame({ map: list, moves: 0, player: [0, 0], x: [0, 0] });
    //// map.setBlock(Math.round(Math.random()*8),Math.round(Math.random()*8),"😳");
    //// map.setBlock(Math.round(Math.random()*8),Math.round(Math.random()*8),"❌");
    //// map.setBlock(1, 1, "😳");
    //// map.setBlock(8, 8, "❌");
    //// map.setBlock(2, 1, "⬛");
    //// map.setBlock(1, 2, "⬛");
    //// map.setBlock(2, 2, "⬛");
    //// map.setBlock(7, 7, "⬛");
    //// map.setBlock(8, 7, "⬛");
    //// map.setBlock(7, 8, "⬛");

    return map.toJSON().map;
}


export interface GuildSchema {
    gameLogs: Snowflake;
}

export interface GameLog {
    id: string;
    won: boolean;
    player: Snowflake;
    type: GameType;
    date: number;
    gotExp: number;
}

export interface HangmanData {
    word: string;
    lastFound: string;
    manStage: number;
    triedChars: string[];
    foundChars:string[]
}

function getLetterDirectory(letter:string){
    return join(process.cwd(),'images','hangman',letter.toLowerCase()+'.png')
    .replace("ç","u1")
    .replace("ğ","u2")
    .replace("ü","u3")
    .replace("ş","u4")
    .replace("ı","u5")
    .replace("ö","u6") //* türkçe karakterler hata verdiği için onlar direk harf almıyor
    .replace("?","question") //? dosya isminde olamıyo ondan
    .replace("i̇","i") // bu harf her neyse artık büyük i yi küçültürken buna dönüştürüyo heralde
}

export function isLetter(letter:string):boolean{
    return "QWERTYUIOPĞÜASDFGHJKLŞİZXCVBNMÖÇ".split("").includes(letter.toUpperCase()) && letter.length==1;
}

export async function generateHangmanImage(data: HangmanData): Promise<Buffer>{
    const canvas = createCanvas(840, 480);
    const ctx = canvas.getContext("2d");
    const mainDir = join(process.cwd(), 'images', 'hangman')
    const image = await loadImage(join(mainDir,'template.png'));

    ctx.drawImage(image, 0, 0);
    ctx.drawImage(await loadImage(getLetterDirectory(data.lastFound[0])),330,88);
    ctx.drawImage(await loadImage(getLetterDirectory(data.lastFound[1])),440,88);
    ctx.drawImage(await loadImage(getLetterDirectory(data.lastFound[2])),542,88);
    ctx.drawImage(await loadImage(getLetterDirectory(data.lastFound[3])),638,88);
    ctx.drawImage(await loadImage(getLetterDirectory(data.lastFound[4])),736,88);
    if(data.manStage>=1) ctx.drawImage(await loadImage(join(mainDir,'head.png')),176,126);
    if(data.manStage>=2) ctx.drawImage(await loadImage(join(mainDir,'body.png')),176,126);
    if(data.manStage>=3) ctx.drawImage(await loadImage(join(mainDir,'larm.png')),176,126);
    if(data.manStage>=4) ctx.drawImage(await loadImage(join(mainDir,'rarm.png')),176,126);
    if(data.manStage>=5) ctx.drawImage(await loadImage(join(mainDir,'lleg.png')),176,126);
    if(data.manStage>=6) ctx.drawImage(await loadImage(join(mainDir,'rleg.png')),176,126);
    if(data.triedChars[0]) ctx.drawImage(await loadImage(getLetterDirectory(data.triedChars[0])),317,343);
    if(data.triedChars[1]) ctx.drawImage(await loadImage(getLetterDirectory(data.triedChars[1])),408,343);
    if(data.triedChars[2]) ctx.drawImage(await loadImage(getLetterDirectory(data.triedChars[2])),499,343);
    if(data.triedChars[3]) ctx.drawImage(await loadImage(getLetterDirectory(data.triedChars[3])),590,343);
    if(data.triedChars[4]) ctx.drawImage(await loadImage(getLetterDirectory(data.triedChars[4])),681,343);


    return canvas.toBuffer();
}

export type RankResolvable = NumberRank | Rank
export type NumberRank = 0|1|2|3|4|5|6|7|8|9|10|11|12|13
export enum Rank {Unranked=0,IronI=1,IronII=2,IronIII=3,BronzeI=4,BronzeII=5,BronzeIII=6,SilverI=7,SilverII=8,SilverIII=9,GoldI=10,GoldII=11,GoldIII=12,Master=13}