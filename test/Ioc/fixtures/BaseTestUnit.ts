
export abstract class BaseTestUnit {
    public abstract checkMe(name: string): boolean;

    public get Type(): string {
        return BaseTestUnit.name;
    }

    IAmSupreme(myName: string): string {
        return myName + "-Supreme";
    }
}