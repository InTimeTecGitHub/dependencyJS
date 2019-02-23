"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentRegistry_1 = require("./src/ComponentRegistry");
exports.ComponentRegistry = ComponentRegistry_1.ComponentRegistry;
var registry = ComponentRegistry_1.ComponentRegistry.getInstance();
exports.registry = registry;
const Config_1 = require("./src/models/Config");
exports.Config = Config_1.Config;
