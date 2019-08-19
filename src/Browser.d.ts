import { BrowserWindow } from "electron";
export declare class Browser {
    url: string;
    win: BrowserWindow;
    constructor();
    init(): Promise<this>;
}
