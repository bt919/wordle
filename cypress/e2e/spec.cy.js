describe('smoke test', () => {
    it('lets users navigate to /play and /custom oages and back to home page', () => {
        // visit home page
        cy.visit("http://localhost:3000")

        // go to play page
        cy.contains("Play").click()
        cy.url().should("eq", "http://localhost:3000/play")

        // go back to home page
        cy.contains("Wordle").click()
        cy.url().should("eq", "http://localhost:3000/")

        // go to custom page
        cy.contains("Create your own").click()
        cy.url().should("eq", "http://localhost:3000/custom")

        // go back to home page
        cy.contains("Wordle").click()
        cy.url().should("eq", "http://localhost:3000/")
    })

    it('lets users make a guess on /play page', () => {
        // visit play page
        cy.visit("http://localhost:3000/play")

        // make a guess
        cy.contains("S").click()
        cy.contains("P").click()
        cy.contains("O").click()
        cy.contains("R").click()
        cy.contains("T").click()

        cy.intercept("POST", "http://localhost:8080/word").as("postWord")

        cy.contains("Enter").click()

        // cy.intercept("POST", "http://localhost:8088/word").as("postWord")

        // cy.wait("@postWord")
        // cy.wait("@postWord").its("response.statusCode").should("eq", 200)

        cy.wait("@postWord").then((interception) => {
            expect(interception.response.statusCode).to.equal(200)
            expect(interception.response.body).to.have.property("correctLetters")
            expect(interception.response.body).to.have.property("misplacedLetters")
            expect(interception.response.body).to.have.property("guess")
        })
    })

    it('does not let users make an invalid guess on /play page', () => {
        // visit play page
        cy.visit("http://localhost:3000/play")

        // make a guess
        cy.contains("S").click()
        cy.contains("X").click()
        cy.contains("R").click()
        cy.contains("O").click()
        cy.contains("T").click()

        cy.intercept("POST", "http://localhost:8080/word").as("postWord")

        cy.contains("Enter").click()

        cy.wait("@postWord").then((interception) => {
            expect(interception.response.statusCode).to.equal(409)
        })
    })

    it('lets users make a custom wordle link, and then visit that page and guess the wordle on the first try', () => {
        // visit custom page
        cy.visit("http://localhost:3000/custom")

        cy.get("input#word").type("clasp")

        cy.intercept("POST", "http://localhost:8080/custom-word").as("postCustomWord")
        cy.contains("Create Link").click()


        cy.wait("@postCustomWord").then((interception) => {
            expect(interception.response.statusCode).to.equal(201)
            expect(interception.response.body).to.have.property("id")

            const id = interception.response.body.id
            cy.visit(`http://localhost:3000/custom/${id}`, { timeout: 8000 })

            cy.contains(/^C$/).click()
            cy.contains(/^L$/).click()
            cy.contains(/^A$/).click()
            cy.contains(/^S$/).click()
            cy.contains(/^P$/).click()

            cy.intercept("POST", `http://localhost:8080/custom-word/${id}`).as("postWord")

            cy.contains("Enter").click()

            cy.wait("@postWord").then((interception) => {
                expect(interception.response.statusCode).to.equal(200)
                expect(interception.response.body).to.have.property("correctLetters")
                expect(interception.response.body.correctLetters).to.have.length(5)
                expect(interception.response.body).to.have.property("misplacedLetters")
                expect(interception.response.body.misplacedLetters).to.have.length(0)
                expect(interception.response.body).to.have.property("guess")
            })
        })
    })
})
