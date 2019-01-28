import ProcessEnv = NodeJS.ProcessEnv;

export class Configuration {
    public get Env() {
        if (typeof window === "undefined") {
            return Env.NODE;
        } else {
            return Env.BROWSER;
        }

    }
}

export enum Env {
    BROWSER,
    NODE
}

export var appConfig = new Configuration();