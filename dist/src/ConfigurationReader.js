"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
const ComponentRegistry_1 = require("./ComponentRegistry");
const ConfigurationSection_1 = require("./models/ConfigurationSection");
const SourceType_1 = require("./models/SourceType");
class ConfigurationReader {
    static getInstance() {
        if (!ConfigurationReader.instance) {
            ConfigurationReader.instance = new ConfigurationReader();
        }
        return ConfigurationReader.instance;
    }
    //load dependencies in container
    loadConfiguration(config) {
        //read all component files
        let folderPath = path.join(config.appDirectory, config.configFolder);
        //get list of files from disk
        let fileNames = fs.readdirSync(folderPath);
        //get configuration from each file and add in configSections object
        let configSections = this.readXmlFilesFromDisk(fileNames, folderPath);
        //register all the configuration dependencies
        this.registerDependencies(configSections, config);
        return true;
    }
    //read and parse files from disk
    readXmlFilesFromDisk(files, folderPath) {
        let configSections = new ConfigurationSection_1.ConfigurationSection();
        configSections.registrationSections = new Array();
        files.forEach(fileName => {
            try {
                let section = require(folderPath + "/" + fileName)["container"];
                if (section && section["register"]) {
                    var registrationData = section["register"];
                    configSections.registrationSections.push.apply(configSections.registrationSections, registrationData);
                }
                else {
                    console.log("No configuration found in registration section : " + fileName);
                }
            }
            catch (ex) {
                throw new Error("There is some issues with configuration file :" + fileName + ", ExceptionDetail: " + ex);
            }
        });
        return configSections;
    }
    //register configuration in container object
    registerDependencies(configuration, folderConfig) {
        if (configuration != null) {
            configuration.registrationSections.forEach((registrationSection) => {
                try {
                    let base = this.getImplementationDetailObject(registrationSection.base, folderConfig);
                    let map = this.getImplementationDetailObject(registrationSection.map, folderConfig);
                    ComponentRegistry_1.ComponentRegistry.getInstance().register(base, new map(), registrationSection.resolver);
                }
                catch (ex) {
                    throw new Error(registrationSection.map.typeName + ": object cant be registered due to some issues. Exception: " + ex);
                }
            });
        }
    }
    getImplementationDetailObject(implProperty, folderConfig) {
        let mapperObject;
        if (implProperty.sourceType == SourceType_1.SourceType.package) {
            mapperObject = require(implProperty.sourceInfo)[implProperty.typeName];
        }
        else {
            mapperObject = require(path.join(folderConfig.appDirectory + implProperty.sourceInfo))[implProperty.typeName];
        }
        return mapperObject;
    }
}
exports.ConfigurationReader = ConfigurationReader;
