import {BaseComponentTest} from "./BaseComponentTest";
export class ComponentTest extends BaseComponentTest {
    Show(name: string): string {
        return "Test " + name;
    }
}