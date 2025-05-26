import fastify from "fastify";
import postgres from "@/plugins/db";
import { wordRoutes } from "@/routes/word/index";
import { customWordRoutes } from "@/routes/custom-word/index";
import type * as pg from "pg";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

declare module "fastify" {
    interface FastifyInstance {
        query: pg.Pool["query"];
    }
}

const server = fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>()

server.register(postgres);
server.register(wordRoutes);
server.register(customWordRoutes);

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
