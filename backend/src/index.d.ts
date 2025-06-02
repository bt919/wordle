import type * as pg from "pg";
declare module "fastify" {
    interface FastifyInstance {
        query: pg.Pool["query"];
    }
}
