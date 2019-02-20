// noinspection ES6UnusedImports
import mocha = require("mocha");
var path = require("path");

import chaiExclude = require("chai-exclude");
import {expect, use} from "chai";
import {ComponentRegistry} from "../../src/ComponentRegistry";
import {registry} from "./../../index";
import Test = Mocha.Test;
import Base = Mocha.reporters.Base;
import {ConfigurationReader} from "../../src/ConfigurationReader";
import {Config} from "../../src/models/Config";
import {BaseComponentTest} from "./fixtures/BaseComponentTest";
import {BaseComponentTestNR} from "./fixtures/BaseComponentTestNR";

use(chaiExclude);

let container: ComponentRegistry;
let configurationReader: ConfigurationReader;
let config: Config;

describe("@ConfigurationReader", async () => {
    before("@ConfigurationReader - configuration reader setup", function (done) {
        container = registry;
        configurationReader = ConfigurationReader.getInstance();
        config = new Config();
        config.configFolder = "/test/Configuration/fixtures/configFiles/";
        config.appDirectory = path.join(__dirname + "/../../");
        done();
    });

    it("@ConfigurationReader - check if reader is able to read test configuration", async function () {
        //Arrange
        let expected: boolean = true;

        //Act
        let actual: boolean = configurationReader.loadConfiguration(config);
        //Assert
        expect(actual).to.be.equals(expected);
    });
    it("@ConfigurationReader - check if classes are properly registered", async function () {
        //Arrange
        let expected: string = "Test sample";

        //Act
        configurationReader.loadConfiguration(config);

        let testComponent: BaseComponentTest = container.resolve<BaseComponentTest>(BaseComponentTest, "test");

        let actual: string = testComponent.Show("sample");

        //Assert
        expect(actual).to.be.equals(expected);
    });
    it("@ComponentRegistry-register class object without resolver", async function () {
        //Arrange
        let expected: string = "Test sample";
        container.cleanContainer();

        //Act
        configurationReader.loadConfiguration(config);

        let testComponent: BaseComponentTestNR = container.resolve<BaseComponentTestNR>(BaseComponentTestNR);

        let actual: string = testComponent.Show("sample");

        //Assert
        expect(actual).to.be.equals(expected);
    });
    after("Finalize", async () => {
        //nothing as of now
    });

});