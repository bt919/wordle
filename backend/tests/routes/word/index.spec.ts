import { describe, expect, test, vi } from "vitest";
import fastify from "fastify";

import app from "../../../src/index.ts";
import { wordRoutes } from "../../../src/routes/word/index.ts"
import postgresMock from "../../__mocks__/plugins/db.ts"

describe("GET /word", async () => {
    test("returns status 200", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/word",
        })

        expect(response.statusCode).toBe(200)
    });

    test("has property word", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/word",
        })

        const body = JSON.parse(response.body)
        expect(body).toHaveProperty("word")
    })
});

describe("POST /word", async () => {
    test("returns status 200 for a valid guess", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/word",
            payload: JSON.stringify({ "guess": "sport" }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        expect(response.statusCode).toBe(200);
    })

    test("returns status 409 for a 5-letter guess that isn't a valid word", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/word",
            payload: JSON.stringify({ "guess": "abcde" }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        expect(response.statusCode).toBe(409);
    })

    test("returns status 400 for a guess that is less than length 5", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/word",
            payload: JSON.stringify({ "guess": "abc" }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        expect(response.statusCode).toBe(400);
    })

    test("returns status 400 for a guess that is greater than length 5", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/word",
            payload: JSON.stringify({ "guess": "abcdefgh" }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        expect(response.statusCode).toBe(400);
    })

    test("body contains 'guess', 'correctLetters', and 'misplacedLetters'", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/word",
            payload: JSON.stringify({ "guess": "sport" }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const body = JSON.parse(response.body)

        expect(body).toHaveProperty("guess")
        expect(body).toHaveProperty("correctLetters")
        expect(body).toHaveProperty("misplacedLetters")
    })

    test("user makes a correct guess", async () => {
        const app = await fastify({
            logger: true
        })

        const decorateQuery = postgresMock([{ rowCount: 3 }, { rows: [{ word: "sport" }] }])
        await app.register(decorateQuery)
        await app.register(wordRoutes)

        const response = await app.inject({
            method: "POST",
            url: "/word",
            payload: JSON.stringify({ "guess": "sport" }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        expect(response.statusCode).toBe(200)

        const body = JSON.parse(response.body)
        expect(body.correctLetters).toHaveLength(5)
        expect(body.misplacedLetters).toHaveLength(0)
    })

    test("user makes a partially correct guess", async () => {
        const app = await fastify({
            logger: true
        })

        const decorateQuery = postgresMock([{ rowCount: 3 }, { rows: [{ word: "sport" }] }])
        await app.register(decorateQuery)
        await app.register(wordRoutes)

        const response = await app.inject({
            method: "POST",
            url: "/word",
            payload: JSON.stringify({ "guess": "spore" }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        expect(response.statusCode).toBe(200)

        const body = JSON.parse(response.body)
        expect(body.correctLetters).toHaveLength(4)
        expect(body.misplacedLetters).toHaveLength(0)
    })

    test("user makes a totally incorrect guess", async () => {
        const app = await fastify({
            logger: true
        })

        const decorateQuery = postgresMock([{ rowCount: 3 }, { rows: [{ word: "sport" }] }])
        await app.register(decorateQuery)
        await app.register(wordRoutes)

        const response = await app.inject({
            method: "POST",
            url: "/word",
            payload: JSON.stringify({ "guess": "bulky" }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        expect(response.statusCode).toBe(200)

        const body = JSON.parse(response.body)
        expect(body.correctLetters).toHaveLength(0)
        expect(body.misplacedLetters).toHaveLength(0)
    })
})
