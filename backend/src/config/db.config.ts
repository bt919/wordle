import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import "dotenv/config";

const ConfigType = Type.Object({
    user: Type.String(),
    password: Type.String(),
    host: Type.String(),
    port: Type.Number(),
    database: Type.String(),
    ssl: Type.Boolean()
});

export const config = Value.Parse(ConfigType, {
    user: process.env.user,
    password: process.env.password,
    host: process.env.host,
    port: process.env.port,
    database: process.env.database,
    ssl: process.env.ssl
});
