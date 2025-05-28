# Wordle Clone

## database
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
200 days. You could instead choose a word each day by doing something like
```
INSERT INTO words SELECT 'your_word_in_single_quotes', NOW()::date;
```
The command below could be used to generate INSERT statement for the allowed_words
table.
```
npx tsx populate_allowed_words.ts > allowed_words_dml.txt
```

## backend
To start running the backend, run the following commands: 
```
$ cp .env.example .env
```
At this point, you should populate the .env file, and then you can run the following
to both run the server, and test it out:
```
$ npm run dev
$ curl http://localhost:8080/ping # this should be ran on another terminal
$ curl http://localhost:8080/word # this works if your db is setup and populated with words
```
