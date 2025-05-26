import type {
	FastifyInstance,
	FastifyPluginOptions,
	HookHandlerDoneFunction,
} from "fastify";

export function wordRoutes(
	fastify: FastifyInstance,
	opts: FastifyPluginOptions,
	done: HookHandlerDoneFunction,
) {
	fastify.get("/word", async (request, reply) => {
		try {
			const result = await fastify.query(
				"SELECT word FROM words WHERE word_date = NOW()::date",
				[],
			);
			const todaysWord = result.rows[0].word;

			reply.send({ word: todaysWord });
		} catch (ex) {
			fastify.log.error(ex);
			return reply.status(500);
		}
	});

	done();
}
