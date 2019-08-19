import { BrowserWindow, webContents } from "electron";
export declare class Browser {
    url: string;
    win: BrowserWindow;
    wincc: webContents;
    constructor();
    init(): Promise<this>;
}
