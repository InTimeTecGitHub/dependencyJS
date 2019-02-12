import {Config} from "./models/Config";
var parser = require("xml2json");
var path = require("path");
var fs = require("fs");
import {ComponentRegistry} from "./ComponentRegistry";
import {ConfigurationSection} from "./models/ConfigurationSection";
import {RegisterSection} from "./models/RegisterSection";
import {SourceType} from "./models/SourceType";

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
                console.log("There is some issues with configuration file :" + fileName);
            }
        });

        this.registerDependencies(configSections, config);

        return true;
    }

    private registerDependencies(configuration: ConfigurationSection, folderConfig:Config) {
        if (configuration != null) {
            configuration.registrationSections.forEach((registrationSection: RegisterSection) => {
                try {
                    let base: any;
                    let map: any;
                    if (registrationSection.typeProperty.sourceType === SourceType.package) {
                        base = require(registrationSection.typeProperty.sourceInfo)[registrationSection.type];
                    }
                    else {
                        base = require(path.join(folderConfig.appDirectory + registrationSection.typeProperty.sourceInfo))[registrationSection.type];
                    }

                    if (registrationSection.mapProperty.sourceType == SourceType.package) {
                        map = require(registrationSection.mapProperty.sourceInfo)[registrationSection.mapTo];
                    }
                    else {
                        map = require(path.join(folderConfig.appDirectory + registrationSection.mapProperty.sourceInfo))[registrationSection.mapTo];
                    }

                    ComponentRegistry.getInstance().register(base, new map(), registrationSection.resolver);
                }
                catch (ex) {
                    console.log(registrationSection.mapTo + ": object cant be registered due to some issues. Exception: " + ex);
                }
            });
        }
    }
}