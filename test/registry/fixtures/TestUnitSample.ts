import {BaseTestUnit} from "./BaseTestUnit";

export class TestUnitSample extends BaseTestUnit {

    public get Type(): string {
        return BaseTestUnit.name;
    }

    public checkMe(name: string): boolean {
        return true;
    }

    IAmSupreme(myName: string): string {
        return myName + "-TestUnitSample";
    }
}
