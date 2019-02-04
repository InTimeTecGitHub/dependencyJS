export class ComponentRegistry {
    private components: Map<string, Map<string, any>>;

    constructor() {
        this.components = new Map<string, any>();
    }

    private static instance: ComponentRegistry;

    public static getInstance(): ComponentRegistry {

        if (!ComponentRegistry.instance) {
            ComponentRegistry.instance = new ComponentRegistry();
        }
        return ComponentRegistry.instance;
    }

    hasComponent(type: any, resolver?: string) {
        let key = new Unit(type, resolver);
        return !this.components.get(key.toString());
    }
    //This method will register dependencies on base class.
    //Multiple classes can be register with one base class using resolver parameter
    public register<T>(base: any, component: T, resolver?: string): boolean {
        if (!(typeof component === "object")) {
            throw new Error("Service can not be registered as a class. It must be a object.");
        }
        let unit: Unit = new Unit(base.name, resolver);
        let typeMap = this.components.get(unit.type);
        if (!typeMap) {
            typeMap = new Map<string, any>();
        }
        this.components.set(unit.type, typeMap);
        typeMap.set(unit.resolver, component)
        return true;
    }

    //This method will resolve registered dependencies
    public resolve<T>(type: any, resolver?: string): T {
        try {
            let key: Unit = new Unit(type.name, resolver);

            let typeMap = this.components.get(key.type);
            let component: any;
            if (typeMap === undefined || typeMap === null) {
                throw new Error("Service:" + type.name + " Not registered");
            }

            component = typeMap.get(key.resolver);
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
        this.components = new Map<string, any>();
        return true;
    }

}

//this class will be only internally used to represent dependencies
class Unit {
    constructor(public type: string, public resolver: string = "*") {}
}