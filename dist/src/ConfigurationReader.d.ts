import { Config } from "./models/Config";
export declare class ConfigurationReader {
    private static instance;
    static getInstance(): ConfigurationReader;
    loadConfiguration(config: Config): boolean;
    private readXmlFilesFromDisk;
    private registerDependencies;
    private getImplementationDetailObject;
}
