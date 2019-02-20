import {Config} from "./models/Config";
var path = require("path");
var fs = require("fs");
import {ComponentRegistry} from "./ComponentRegistry";
import {ConfigurationSection} from "./models/ConfigurationSection";
import {RegisterSection} from "./models/RegisterSection";
import {SourceType} from "./models/SourceType";
import {ImplementationSection} from "./models/ImplementationSection";

export class ConfigurationReader {

    private static instance: ConfigurationReader;

    public static getInstance(): ConfigurationReader {

        if (!ConfigurationReader.instance) {
            ConfigurationReader.instance = new ConfigurationReader();
        }
        return ConfigurationReader.instance;
    }

    //load dependencies in container
    public loadConfiguration(config: Config): boolean {

        //read all component files
        let folderPath: string = path.join(config.appDirectory, config.configFolder);

        //get list of files from disk
        let fileNames: Array<string> = fs.readdirSync(folderPath);

        //get configuration from each file and add in configSections object
        let configSections: ConfigurationSection = this.readXmlFilesFromDisk(fileNames, folderPath);

        //register all the configuration dependencies
        this.registerDependencies(configSections, config);
        return true;
    }

    //read and parse files from disk
    private readXmlFilesFromDisk(files: Array<string>, folderPath: string): ConfigurationSection {
        let configSections: ConfigurationSection = new ConfigurationSection();
        configSections.registrationSections = new Array<RegisterSection>();

        files.forEach(fileName => {
            try {
                let section: any = require(folderPath + "/" + fileName)["container"];

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
    private registerDependencies(configuration: ConfigurationSection, folderConfig: Config) {
        if (configuration != null) {
            configuration.registrationSections.forEach((registrationSection: RegisterSection) => {
                try {
                    let base: any = this.getImplementationDetailObject(registrationSection.base,  folderConfig);
                    let map: any = this.getImplementationDetailObject(registrationSection.map, folderConfig);

                    ComponentRegistry.getInstance().register(base, new map(), registrationSection.resolver);
                }
                catch (ex) {
                    throw new Error(registrationSection.map.typeName + ": object cant be registered due to some issues. Exception: " + ex);
                }
            });
        }
    }

    private getImplementationDetailObject(implProperty: ImplementationSection, folderConfig: Config) {
        let mapperObject: any;
        if (implProperty.sourceType == SourceType.package) {
            mapperObject = require(implProperty.sourceInfo)[implProperty.typeName];
        }
        else {
            mapperObject = require(path.join(folderConfig.appDirectory + implProperty.sourceInfo))[implProperty.typeName];
        }
        return mapperObject;
    }
}