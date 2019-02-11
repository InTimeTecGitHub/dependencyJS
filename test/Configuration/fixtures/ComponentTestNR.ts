import {BaseComponentTestNR} from "./BaseComponentTestNR";
export class ComponentTestNR extends BaseComponentTestNR {
    Show(name: string): string {
        return "Test " + name;
    }
}