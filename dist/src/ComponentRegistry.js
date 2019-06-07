"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationReader_1 = require("./ConfigurationReader");
class ComponentRegistry {
    constructor() {
        this.components = new Map();
    }
    static getInstance() {
        if (!ComponentRegistry.instance) {
            ComponentRegistry.instance = new ComponentRegistry();
        }
        return ComponentRegistry.instance;
    }
    hasComponent(type, resolver) {
        let key = new Unit(type, resolver);
        let typeMap = this.components.get(key.type);
        if (!typeMap)
            return false;
        return !typeMap.get(key.resolver);
    }
    //This method will register dependencies on base class.
    //Multiple classes can be register with one base class using resolver parameter
    register(base, component, resolver) {
        if (!(typeof component === "object")) {
            throw new Error("Service can not be registered as a class. It must be a object.");
        }
        let unit = new Unit(base.name, resolver);
        let typeMap = this.components.get(unit.type);
        if (!typeMap) {
            typeMap = new Map();
        }
        this.components.set(unit.type, typeMap);
        typeMap.set(unit.resolver, component);
        return true;
    }
    //This method will resolve registered dependencies
    resolve(type, resolver) {
        try {
            let key = new Unit(type.name, resolver);
            let typeMap = this.components.get(key.type);
            let component;
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
    //this method will register dependencies from xml configuration
    loadConfiguration(config) {
        return ConfigurationReader_1.ConfigurationReader.getInstance().loadConfiguration(config);
    }
    //This method will clean container. all the registered dependencies will be cleaned.
    cleanContainer() {
        this.components = new Map();
        return true;
    }
}
exports.ComponentRegistry = ComponentRegistry;
//this class will be only internally used to represent dependencies
class Unit {
    constructor(type, resolver = "*") {
        this.type = type;
        this.resolver = resolver;
    }
}
