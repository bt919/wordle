"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const typebox_1 = require("@sinclair/typebox");
const value_1 = require("@sinclair/typebox/value");
require("dotenv/config");
const ConfigType = typebox_1.Type.Object({
    user: typebox_1.Type.String(),
    password: typebox_1.Type.String(),
    host: typebox_1.Type.String(),
    port: typebox_1.Type.Number(),
    database: typebox_1.Type.String(),
    ssl: typebox_1.Type.Boolean()
});
exports.config = value_1.Value.Parse(ConfigType, {
    user: process.env.user,
    password: process.env.password,
    host: process.env.host,
    port: process.env.port,
    database: process.env.database,
    ssl: process.env.ssl
});
