# Wordle Clone

## Introduction
This project is a clone of the game Wordle. It uses vite,react and typescript on the frontend, fastify
and typescript on the backend, and postgresql for the database. The infrastructure is as follows:
- database is hosted using supabase
- backend is hosted using aws lambda and aws api gateway
- frontend is hosted using cloudfare pages

### Features
- classic wordle mode
- custom wordle mode (create your own 5-letter wordle, and send it to others via a custom link)

## Database
This project uses a postgresql database. You can run the ddl file against your
local postgres db to populate it with empty tables with the following:
```
$ cd backend 
$ sudo -u user_name -d database_name -f sql/ddl.sql
```

You can populate the words table with rows with the following:
```
$ npm install
$ npx tsx sql/populate.ts > sql/dml.sql
$ sudo -u user_name -d database_name -f sql/dml.sql
```
The command above populates the words table with random words for the next
200 days. You could instead choose a word each day by doing something like:
```
INSERT INTO words SELECT 'your_word_in_single_quotes', NOW()::date;
```
The command below could be used to generate INSERT statement for the allowed_words
table:
```
$ npx tsx populate_allowed_words.ts > allowed_words_dml.txt
```

## Backend
To start running the backend, run the following commands: 
```
$ cd backend
$ cp .env.example .env
```
At this point, you should populate the .env file, and then you can run the following
to both run the server, and test it out:
```
$ npm run dev
$ curl -X POST http://localhost:8080/word -H "Content-Type: application/json" -d '{"guess": "sport"}'
```

## Frontend
To run the frontend, run the following commands (you may need to change src/lib/api-url.ts):
```
$ cd frontend
$ npm install
$ npm run dev
```

## Tests
To run e2e tests using cypress,first run the backend and frontend and then run the following in the 
root directory (you may need to install some packages if you're using linux 
https://docs.cypress.io/app/get-started/install-cypress#Linux-Prerequisites):
```
npm run test
```

To run frontend tests using vitest, run the following:
```
$ cd frontend
$ npm run test
```

To run backend tests using vitest, run the following:
```
$ cd backend
$ npm run test:run
```
