"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("@/config/db.config");
const pg_pool_1 = __importDefault(require("pg-pool"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const pool = new pg_pool_1.default(db_config_1.config);
function postgresPlugin(fastify, options, done) {
    if (!fastify.query) {
        function query(query_1) {
            return __awaiter(this, arguments, void 0, function* (query, params = []) {
                if (query.trim().length === 0) {
                    throw new Error("query string must be provided");
                }
                const result = yield pool.query(query, params);
                return result;
            });
        }
        fastify.decorate("query", query);
    }
    done();
}
exports.default = (0, fastify_plugin_1.default)(postgresPlugin);
