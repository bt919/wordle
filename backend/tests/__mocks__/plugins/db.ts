import { vi } from "vitest";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

function postgresPluginMock(mockResponses: unknown[] = []) {
	return fp(function postgresPluginMock(
		fastify: FastifyInstance,
		options: FastifyPluginOptions,
		done: () => void,
	) {
		if (!fastify.query) {
			const queryMock = vi.fn();
			for (let i = 0; i < mockResponses.length; i += 1) {
				queryMock.mockImplementationOnce(async () => mockResponses[i]);
			}
			fastify.decorate("query", queryMock);
		}

		done();
	});
}

export default postgresPluginMock;
