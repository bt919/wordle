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
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const index_1 = require("@/routes/custom-word/index");
const db_1 = __importDefault(require("@/plugins/db"));
const index_2 = require("@/routes/word/index");
const server = (0, fastify_1.default)({
    logger: true,
}).withTypeProvider();
server.register(db_1.default);
server.register(cors_1.default, {});
server.register(index_2.wordRoutes);
server.register(index_1.customWordRoutes);
server.get("/ping", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return "bong\n";
}));
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
