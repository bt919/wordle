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

	fastify.post(
		"/custom-word/:id",
		{
			schema: {
				body: Type.Object({
					guess: Type.String({
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
				params: Type.Object({
					id: Type.String({
						minLength: 22,
						maxLength: 22,
					}),
				}),
			},
		},
		async (
			request: FastifyRequest<{
				Body: { guess: string; password: string };
				Params: { id: string };
			}>,
			reply: FastifyReply,
		) => {
			try {
				const id = request.params.id;
				const { guess, password } = request.body;

				const params = [id];
				const result = await fastify.query(
					`SELECT word, hashed_password AS hash
                                                FROM user_defined_words
                                                WHERE id = $1`,
					params,
				);
				const { word, hash } = result.rows[0];
				fastify.log.info({ word, hash });
				if (word.length !== guess.length) {
					return reply
						.status(400)
						.send({ message: "word is incorrect length" });
				}
				if (hash) {
					const isPasswordCorrect = await bcrypt.compare(password, hash);
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
					} else if (word.indexOf(ch) !== -1) {
						misplacedLetters.push(i);
					}
				}

				return reply
					.status(200)
					.send({ correctLetters, misplacedLetters, guess });
			} catch (ex) {
				fastify.log.error(ex);
				return reply
					.status(500)
					.send({ message: "Unexpected error. Try again later." });
			}
		},
	);

	fastify.get(
		"/custom-word/:id",
		{
			schema: {
				params: Type.Object({
					id: Type.String({
						minLength: 22,
						maxLength: 22,
					}),
				}),
			},
		},
		async (
			request: FastifyRequest<{ Params: { id: string } }>,
			reply: FastifyReply,
		) => {
			try {
				const id = request.params.id;

				const params = [id];
				const result = await fastify.query(
					`SELECT word
                                                FROM user_defined_words
                                                WHERE id = $1`,
					params,
				);

				if (result.rowCount === 0) {
					return reply.status(404).send({});
				}

				const { word } = result.rows[0];

				return reply.status(200).send({ wordLength: word.length });
			} catch (ex) {
				fastify.log.error(ex);
				return reply
					.status(500)
					.send({ message: "Unexpected error. Try again later." });
			}
		},
	);

	done();
}
