"use strict";
/**
 * @file api.ts
 * @description The public API for the llcacodec library
 * @author Jacoby Johnson
 * @version 0.1.5
 * @date April 11th, 2023
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLifeStringFormat = exports.isLifeStringFormat = exports.writeLifeString = exports.readLifeString = exports.convertLifeRule = exports.getLifeRuleFormat = exports.isValidLifeRule = exports.makeLifeRule = exports.readLifeRule = exports.CONWAY_LIFE_RULE_DATA = void 0;
const rule_1 = require("./formats/rule");
const file_1 = require("./formats/file");
var ruleData_1 = require("./formats/rule/ruleData");
Object.defineProperty(exports, "CONWAY_LIFE_RULE_DATA", { enumerable: true, get: function () { return ruleData_1.CONWAY_LIFE_RULE_DATA; } });
var rule_2 = require("./formats/rule");
Object.defineProperty(exports, "readLifeRule", { enumerable: true, get: function () { return rule_2.readLifeRule; } });
Object.defineProperty(exports, "makeLifeRule", { enumerable: true, get: function () { return rule_2.makeLifeRule; } });
Object.defineProperty(exports, "isValidLifeRule", { enumerable: true, get: function () { return rule_2.isValidLifeRule; } });
Object.defineProperty(exports, "getLifeRuleFormat", { enumerable: true, get: function () { return rule_2.getLifeRuleFormat; } });
Object.defineProperty(exports, "convertLifeRule", { enumerable: true, get: function () { return rule_2.convertLifeRule; } });
var file_2 = require("./formats/file");
Object.defineProperty(exports, "readLifeString", { enumerable: true, get: function () { return file_2.readLifeString; } });
Object.defineProperty(exports, "writeLifeString", { enumerable: true, get: function () { return file_2.writeLifeString; } });
Object.defineProperty(exports, "isLifeStringFormat", { enumerable: true, get: function () { return file_2.isLifeStringFormat; } });
Object.defineProperty(exports, "getLifeStringFormat", { enumerable: true, get: function () { return file_2.getLifeStringFormat; } });
exports.default = {
    readLifeString: file_1.readLifeString,
    writeLifeString: file_1.writeLifeString,
    isLifeStringFormat: file_1.isLifeStringFormat,
    getLifeStringFormat: file_1.getLifeStringFormat,
    makeLifeRule: rule_1.makeLifeRule,
    isValidLifeRule: rule_1.isValidLifeRule,
    getLifeRuleFormat: rule_1.getLifeRuleFormat,
    readLifeRule: rule_1.readLifeRule,
    convertLifeRule: rule_1.convertLifeRule
};
