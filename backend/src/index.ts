import cors from "@fastify/cors";
import fastify from "fastify";
import type * as pg from "pg";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { customWordRoutes } from "@/routes/custom-word/index";
import postgres from "@/plugins/db";
import { wordRoutes } from "@/routes/word/index";

declare module "fastify" {
    interface FastifyInstance {
        query: pg.Pool["query"];
    }
}

const app = fastify({
    logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

app.register(postgres);
app.register(cors, {});
app.register(wordRoutes);
app.register(customWordRoutes);

app.get("/ping", async (request, reply) => {
    return "bong\n";
});

if (require.main === module) {
    app.listen({ port: 8080 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
} else {
    module.exports = app
}
