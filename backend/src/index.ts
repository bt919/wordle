import fastify from "fastify";
import postgres from "@/plugins/db";
import { wordRoutes } from "@/routes/word/index";
import type * as pg from "pg";

declare module "fastify" {
    interface FastifyInstance {
        query: pg.Pool["query"];
    }
}

const server = fastify({
    logger: true,
});

server.register(postgres);
server.register(wordRoutes);

server.get("/ping", async (request, reply) => {
    return "bong\n";
});

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
