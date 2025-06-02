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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordRoutes = wordRoutes;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
function wordRoutes(fastify, opts, done) {
    fastify.post("/word", {
        schema: {
            body: type_provider_typebox_1.Type.Object({
                guess: type_provider_typebox_1.Type.String({
                    minLength: 5,
                    maxLength: 5,
                }),
            }),
        },
    }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { guess } = request.body;
            const isWordValid = yield fastify.query("SELECT 1 FROM allowed_words WHERE $1 ILIKE word", [guess]);
            if (isWordValid.rowCount === 0) {
                return reply.status(409).send({});
            }
            const result = yield fastify.query("SELECT word FROM words WHERE word_date = NOW()::date");
            const word = result.rows[0].word;
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
            return reply.status(500).send({});
        }
    }));
    done();
}
