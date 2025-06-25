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

app.log.info("registering postgres")
app.register(postgres);
app.log.info("registering cors")
app.register(cors, {});
app.log.info("registering word routes")
app.register(wordRoutes);
app.log.info("registering customWord routes")
app.register(customWordRoutes);

if (require.main === module) {
    app.log.info("server is about to start")
    app.listen({ port: 8080 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
}

export default app;
