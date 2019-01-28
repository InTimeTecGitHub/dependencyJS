
import {appConfig, Env} from "./src/config/Configuration";
import {ComponentRegistry} from "./src/ComponentRegistry";
export {ComponentRegistry};
declare var window: any;
if (appConfig.Env === Env.BROWSER) {
    window.ComponentRegistry = ComponentRegistry;
}