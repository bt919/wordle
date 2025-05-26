import { config } from "@/config/db.config";
import Pool from "pg-pool";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

const pool = new Pool(config);

function postgresPlugin(
	fastify: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void,
) {
	if (!fastify.query) {
		async function query(query: string, params: string[]) {
			const result = await pool.query(query, params);
			return result;
		}
		fastify.decorate("query", query);
	}

	done();
}

// export const query = async (query: string, params: string[]) => {
// 	const result = await pool.query(query, params);
// 	return result;
// };

export default fp(postgresPlugin);
