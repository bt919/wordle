import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export function wordRoutes(
	fastify: FastifyInstance,
	opts: FastifyPluginOptions,
	done: () => void,
) {
	fastify.get("/word", async (request, reply) => {
		try {
			const result = await fastify.query(
				"SELECT word FROM words WHERE word_date = NOW()::date",
				[],
			);
			const todaysWord = result.rows[0].word;

			reply.send({ todaysWord });
		} catch (ex) {
			fastify.log.error(ex);
			return reply.status(500);
		}
	});

	done();
}
