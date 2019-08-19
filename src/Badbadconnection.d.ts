import { BrowserWindow, webContents } from "electron";
export declare class Badbadconnection {
    url: string;
    win: BrowserWindow;
    wincc: webContents;
    on_resv_func: (msg: string) => void;
    channel: string;
    constructor(channel: string);
    init(): Promise<this>;
    send(msg: string): void;
    on_recv(_func: (msg: string) => void): void;
}
