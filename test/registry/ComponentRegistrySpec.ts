// noinspection ES6UnusedImports
import mocha = require("mocha");
var path = require("path");
import chaiExclude = require("chai-exclude");
import {expect, use} from "chai";
import {ComponentRegistry} from "../../src/ComponentRegistry";
import {registry} from "./../../index";
import {BaseTestUnit} from "./fixtures/BaseTestUnit";
import {TestUnitSample} from "./fixtures/TestUnitSample";
import Test = Mocha.Test;
import Base = Mocha.reporters.Base;
import {TestUnitSecondSample} from "./fixtures/TestUnitSecondSample";
import {BaseComponentTest} from "../Configuration/fixtures/BaseComponentTest";
import {Config} from "../../src/models/Config";

use(chaiExclude);

let container: ComponentRegistry;

describe("@ComponentRegistry", async () => {
    before("@ComponentRegistry - container setup", function (done) {
        container = registry;
        done();
    });

    it("@ComponentRegistry - check if we can register a class with abstract base class", async function () {
        //Arrange
        container.cleanContainer();
        let expected: boolean = true;

        let testUnitSample: BaseTestUnit = new TestUnitSample();
        //Act
        let actual = container.register<BaseTestUnit>(BaseTestUnit, testUnitSample);

        //Assert
        expect(actual).to.be.equals(expected);
    });
    it("@ComponentRegistry-registering same class again should not give any error", async function () {
        //Arrange
        container.cleanContainer();
        let expected: boolean = true;

        let testUnitSample: BaseTestUnit = new TestUnitSample();
        //Act
        let actual = container.register<BaseTestUnit>(BaseTestUnit, testUnitSample);
        actual = container.register<BaseTestUnit>(BaseTestUnit, testUnitSample);

        //Assert
        expect(actual).to.be.equals(expected);
    });
    it("@ComponentRegistry-register class object with resolver", async function () {
        //Arrange
        let testUnit: TestUnitSample = new TestUnitSample();
        container.cleanContainer();
        let expected: boolean = container.register<BaseTestUnit>(BaseTestUnit, testUnit, "TestClass");

        //Act
        let actual = true;

        //Assert
        expect(actual).to.be.equals(expected);
    });
    it("@ComponentRegistry-registered object should be resolved", async function () {
        //Arrange
        let testUnit: TestUnitSample = new TestUnitSample();
        container.cleanContainer();
        let testUnitSample: BaseTestUnit = new TestUnitSample();
        container.register<BaseTestUnit>(BaseTestUnit, testUnitSample);
        let resolvedUnitSample: BaseTestUnit = container.resolve<BaseTestUnit>(BaseTestUnit);

        let expected: boolean = true;

        //Act
        let actual = resolvedUnitSample.checkMe("something");
        //Assert
        expect(actual).to.be.equals(expected);
    });

    it("@ComponentRegistry-registered object should be resolved using resolver", async function () {
        //Arrange
        let testUnit: TestUnitSample = new TestUnitSample();
        container.cleanContainer();
        let testUnitSample: BaseTestUnit = new TestUnitSample();
        container.register<BaseTestUnit>(BaseTestUnit, testUnitSample, "TestUnit");
        let resolvedUnitSample: BaseTestUnit = container.resolve<BaseTestUnit>(BaseTestUnit, "TestUnit");

        let expected: boolean = true;

        //Act
        let actual = resolvedUnitSample.checkMe("something");
        //Assert
        expect(actual).to.be.equals(expected);
    });
    it("@ComponentRegistry-not registered object should return exception", async function () {
        //Arrange
        let resolvedUnitSample: BaseTestUnit;
        container.cleanContainer();
        let expected: string = "Unit 'BaseTestUnit' is not registered";
        let actual: string = "unexpected";

        //Act
        try {
            resolvedUnitSample = container.resolve<BaseTestUnit>(BaseTestUnit);
        }
        catch (ex) {
            actual = ex.message;
        }

        //Assert
        expect(actual).to.be.equals(expected);
    });
    it("@ComponentRegistry-register same class with multiple names should work", async function () {
        //Arrange
        container.cleanContainer();
        let testUnit: TestUnitSample = new TestUnitSample();
        container.cleanContainer();
        let testUnitSample: BaseTestUnit = new TestUnitSample();
        container.register<BaseTestUnit>(BaseTestUnit, testUnitSample, "TestUnit1");
        container.register<BaseTestUnit>(BaseTestUnit, testUnitSample, "TestUnit2");
        let resolvedUnitSample1: BaseTestUnit = container.resolve<BaseTestUnit>(BaseTestUnit, "TestUnit1");
        let resolvedUnitSample2: TestUnitSample = container.resolve<BaseTestUnit>(BaseTestUnit, "TestUnit2");

        let expected: boolean = true;

        //Act
        let actual = (resolvedUnitSample1.checkMe("something") && resolvedUnitSample1.checkMe("something")) ? true : false;
        //Assert
        expect(actual).to.be.equals(expected);
    });

    it("@ConfigurationReader - check configuration reader is working as expected", async function () {
        //Arrange
        let expected: string = "Test sample";
        let config: Config = new Config();
        config.configFolder = "/test/Configuration/fixtures/configFiles/";
        config.appDirectory = path.join(__dirname + "/../../");

        //Act
        registry.loadConfiguration(config);

        let testComponent: BaseComponentTest = container.resolve<BaseComponentTest>(BaseComponentTest, "test");

        let actual: string = testComponent.Show("sample");

        //Assert
        expect(actual).to.be.equals(expected);
    });
    after("Finalize", async () => {
        //nothing as of now
    });

});