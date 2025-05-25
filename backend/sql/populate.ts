import { faker } from "@faker-js/faker"

const unique = [];
const numberOfWords = 200;
while (unique.length < numberOfWords) {
    const current = faker.word.sample(5)
    if (unique.indexOf(current) === -1) {
        console.log(`INSERT INTO words SELECT '${current}', NOW()::date + ${unique.length};`);
        unique.push(current)
    }
}

