import type {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyRequest,
    FastifyReply,
    HookHandlerDoneFunction,
} from "fastify";
import { Type } from "@fastify/type-provider-typebox";
import bcrypt from "bcryptjs";
import short from "short-uuid";

export function customWordRoutes(
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: HookHandlerDoneFunction,
) {
    fastify.post(
        "/custom-word",
        {
            schema: {
                body: Type.Object({
                    word: Type.String({
                        minLength: 3,
                        maxLength: 10,
                    }),
                    password: Type.Optional(
                        Type.String({
                            minLength: 8,
                            maxLength: 50,
                        }),
                    ),
                }),
            },
        },
        async (
            request: FastifyRequest<{ Body: { word: string; password: string } }>,
            reply: FastifyReply,
        ) => {
            try {
                const { word, password } = request.body;

                const id = short.generate();
                if (password) {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(password, salt);
                    const params = [id, word.toLowerCase(), hash];
                    await fastify.query(
                        "INSERT INTO user_defined_words (id, word, hashed_password) VALUES ($1, $2, $3)",
                        params,
                    );
                } else {
                    const params = [id, word.toLowerCase()];
                    await fastify.query(
                        "INSERT INTO user_defined_words (id, word) VALUES ($1, $2)",
                        params,
                    );
                }

                return reply.status(201).send({ message: "success" });
            } catch (ex) {
                fastify.log.error(ex);
                return reply.status(500).send({});
            }
        },
    );

    done();
}
