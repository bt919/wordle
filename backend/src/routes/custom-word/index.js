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
exports.customWordRoutes = customWordRoutes;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const short_uuid_1 = __importDefault(require("short-uuid"));
function customWordRoutes(fastify, opts, done) {
    fastify.post("/custom-word", {
        schema: {
            body: type_provider_typebox_1.Type.Object({
                word: type_provider_typebox_1.Type.String({
                    minLength: 5,
                    maxLength: 5,
                }),
                password: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String({
                    minLength: 8,
                    maxLength: 50,
                })),
            }),
        },
    }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { word, password } = request.body;
            const id = short_uuid_1.default.generate();
            if (password) {
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hash = yield bcryptjs_1.default.hash(password, salt);
                const params = [id, word.toLowerCase(), hash];
                yield fastify.query("INSERT INTO user_defined_words (id, word, hashed_password) VALUES ($1, $2, $3)", params);
            }
            else {
                const params = [id, word.toLowerCase()];
                yield fastify.query("INSERT INTO user_defined_words (id, word) VALUES ($1, $2)", params);
            }
            return reply.status(201).send({ message: "success", id });
        }
        catch (ex) {
            fastify.log.error(ex);
            return reply.status(500).send({});
        }
    }));
    fastify.post("/custom-word/:id", {
        schema: {
            body: type_provider_typebox_1.Type.Object({
                guess: type_provider_typebox_1.Type.String({
                    minLength: 3,
                    maxLength: 10,
                }),
                password: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String({
                    minLength: 8,
                    maxLength: 50,
                })),
            }),
            params: type_provider_typebox_1.Type.Object({
                id: type_provider_typebox_1.Type.String({
                    minLength: 22,
                    maxLength: 22,
                }),
            }),
        },
    }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const id = request.params.id;
            const { guess, password } = request.body;
            const params = [id];
            const result = yield fastify.query(`SELECT word, hashed_password AS hash
                                                FROM user_defined_words
                                                WHERE id = $1`, params);
            const { word, hash } = result.rows[0];
            const isWordValid = yield fastify.query("SELECT 1 FROM allowed_words WHERE $1 ILIKE word", [guess]);
            fastify.log.info({ guess, word });
            if (isWordValid.rowCount === 0 && word !== guess.toLowerCase()) {
                return reply.status(409).send({});
            }
            if (word.length !== guess.length) {
                return reply
                    .status(400)
                    .send({ message: "word is incorrect length" });
            }
            if (hash) {
                const isPasswordCorrect = yield bcryptjs_1.default.compare(password, hash);
                if (!isPasswordCorrect) {
                    return reply.status(400).send({ message: "password is incorrect" });
                }
            }
            const correctLetters = [];
            const misplacedLetters = [];
            for (let i = 0; i < guess.length; i += 1) {
                const ch = guess.charAt(i).toLowerCase();
                if (ch === word.charAt(i)) {
                    correctLetters.push(i);
                }
                else if (word.indexOf(ch) !== -1) {
                    misplacedLetters.push(i);
                }
            }
            return reply
                .status(200)
                .send({ correctLetters, misplacedLetters, guess });
        }
        catch (ex) {
            fastify.log.error(ex);
            return reply
                .status(500)
                .send({ message: "Unexpected error. Try again later." });
        }
    }));
    fastify.get("/custom-word/:id", {
        schema: {
            params: type_provider_typebox_1.Type.Object({
                id: type_provider_typebox_1.Type.String({
                    minLength: 22,
                    maxLength: 22,
                }),
            }),
        },
    }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const id = request.params.id;
            const params = [id];
            const result = yield fastify.query(`SELECT word
                                                FROM user_defined_words
                                                WHERE id = $1`, params);
            if (result.rowCount === 0) {
                return reply.status(404).send({});
            }
            const { word } = result.rows[0];
            return reply.status(200).send({ wordLength: word.length });
        }
        catch (ex) {
            fastify.log.error(ex);
            return reply
                .status(500)
                .send({ message: "Unexpected error. Try again later." });
        }
    }));
    done();
}
