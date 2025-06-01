import type {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyReply,
    FastifyRequest,
    HookHandlerDoneFunction,
} from "fastify";
import { Type } from "@fastify/type-provider-typebox";

export function wordRoutes(
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction,
) {
    fastify.post(
        "/word",
        {
            schema: {
                body: Type.Object({
                    guess: Type.String({
                        minLength: 5,
                        maxLength: 5,
                    }),
                }),
            },
        },
        async (
            request: FastifyRequest<{ Body: { guess: string } }>,
            reply: FastifyReply,
        ) => {
            try {
                const { guess } = request.body;

                const isWordValid = await fastify.query("SELECT 1 FROM allowed_words WHERE $1 ILIKE word", [guess])
                if (isWordValid.rowCount === 0) {
                    return reply.status(409).send({})
                }

                const result = await fastify.query(
                    "SELECT word FROM words WHERE word_date = NOW()::date",
                );
                const word = result.rows[0].word;

                const correctLetters = [];
                const misplacedLetters = [];
                for (let i = 0; i < guess.length; i += 1) {
                    const ch = guess.charAt(i).toLowerCase();
                    if (ch === word.charAt(i)) {
                        correctLetters.push(i);
                    } else if (word.indexOf(ch) !== -1) {
                        misplacedLetters.push(i);
                    }
                }

                return reply
                    .status(200)
                    .send({ correctLetters, misplacedLetters, guess });
            } catch (ex) {
                fastify.log.error(ex);
                return reply.status(500).send({});
            }
        },
    );

    done();
}
