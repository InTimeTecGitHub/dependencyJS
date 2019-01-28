export class ComponentRegistry {
    private components: Map<Unit, any>;

    constructor() {
        this.components = new Map<Unit, any>();
    }

    private static instance: ComponentRegistry;

    public static getInstance(): ComponentRegistry {

        if (!ComponentRegistry.instance) {
            ComponentRegistry.instance = new ComponentRegistry();
        }
        return ComponentRegistry.instance;
    }

    //This method will register dependencies on base class.
    //Multiple classes can be register with one base class using resolver parameter
    public register<T>(base: any, component: T, resolver?: string): boolean {
        if (!(typeof component === "object")) {
            throw new Error("Service can not be registered as a class. It must be a object.");
        }
        let unit: Unit = new Unit();
        unit.type = base.name;
        unit.resolver = resolver;

        let keys: Array<Unit> = Array.from(this.components.keys());
        //get if key already exist
        for (let order: number = 0; order < keys.length; order++) {
            if (keys[order].type === base.name && keys[order].resolver === resolver) {
                //if key exist, use this key to store the object at same place in map
                unit = keys[order];
                break;
            }
        }

        this.components.set(unit, component);
        return true;
    }

    //This method will resolve registered dependencies
    public resolve<T>(type: any, resolver?: string): T {
        try {
            let keys = Array.from(this.components.keys());

            let key: Unit = new Unit();

            for (let order: number = 0; order < keys.length; order++) {
                if (keys[order].type === type.name && keys[order].resolver === resolver) {
                    key = keys[order];
                    break;
                }
            }

            let component = this.components.get(key);

            if (component === undefined || component === null) {
                throw new Error("Service:" + type.name + " Not registered");
            }

            return component;
        }
        catch (ex) {
            //log error
            throw new Error("Unit '" + type.name + "' is not registered");
        }
    }

    //This method will clean container. all the registered dependencies will be cleaned.
    public cleanContainer(): boolean {
        this.components = new Map<Unit, any>();
        return true;
    }

}

//this class will be only internally used to represent dependencies
class Unit {
    type: string;
    resolver: string | undefined;
}