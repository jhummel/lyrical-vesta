export declare const VESTA_URL = "https://rw.vestaboard.com";
export declare const COLUMNS = 22;
export declare const ROWS = 6;
export declare function getVestaFormattedChars(message: string): number[];
export declare function chunkWordsToLines(wordArr: number[][]): number[][][];
export declare function getVestaFormattedLines(message: string): number[][];
export declare class Vestaboard {
    key: string;
    constructor(key: string);
    sendMessage(message: string): Promise<any>;
}
