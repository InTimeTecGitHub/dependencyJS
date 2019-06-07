import { Config } from "./models/Config";
export declare class ComponentRegistry {
    private components;
    constructor();
    private static instance;
    static getInstance(): ComponentRegistry;
    hasComponent(type: any, resolver?: string): boolean;
    register<T>(base: any, component: T, resolver?: string): boolean;
    resolve<T>(type: any, resolver?: string): T;
    loadConfiguration(config: Config): boolean;
    cleanContainer(): boolean;
}
