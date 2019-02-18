import {Config} from "./models/Config";
var parser = require("xml2json");
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

    public loadConfiguration(config: Config): boolean {

        let configSections: ConfigurationSection = new ConfigurationSection();
        configSections.registrationSections = new Array<RegisterSection>();

        //read all component files
        let folderPath: string = path.join(config.appDirectory, config.configXmlFolder);
        let fileNames: Array<string> = fs.readdirSync(folderPath);
        fileNames.forEach(fileName => {
            try {
                let section: any = fs.readFileSync(folderPath + "/" + fileName);
                var registrationData = JSON.parse(parser.toJson(section).toString())["container"]["register"];
                if (registrationData) {
                    if (Array.isArray(registrationData)) {
                        configSections.registrationSections.push.apply(configSections.registrationSections, registrationData);
                    }
                    else {
                        configSections.registrationSections.push(registrationData);
                    }
                }
                else {
                    console.log("No configuration found in registration section : " + fileName);
                }
            }
            catch (ex) {
               throw new Error("There is some issues with configuration file :" + fileName + ", ExceptionDetail: " + ex);
            }
        });

        this.registerDependencies(configSections, config);

        return true;
    }

    private registerDependencies(configuration: ConfigurationSection, folderConfig: Config) {
        if (configuration != null) {
            configuration.registrationSections.forEach((registrationSection: RegisterSection) => {
                try {
                    let base: any = this.getImplementationDetailObject(registrationSection.typeProperty, registrationSection.type, folderConfig);
                    let map: any = this.getImplementationDetailObject(registrationSection.mapProperty, registrationSection.mapTo, folderConfig);

                    ComponentRegistry.getInstance().register(base, new map(), registrationSection.resolver);
                }
                catch (ex) {
                    throw new Error(registrationSection.mapTo + ": object cant be registered due to some issues. Exception: " + ex);
                }
            });
        }
    }

    private getImplementationDetailObject(implProperty: ImplementationSection, mapper: string, folderConfig: Config) {
        let mapperObject: any;
        if (implProperty.sourceType == SourceType.package) {
            mapperObject = require(implProperty.sourceInfo)[mapper];
        }
        else {
            mapperObject = require(path.join(folderConfig.appDirectory + implProperty.sourceInfo))[mapper];
        }
        return mapperObject;
    }
}