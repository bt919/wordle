# wordle clone

## database
This project uses a postgresql database. you can run a ddl file against your
local postgres db to populate it with empty tables:
```
$ cd backend 
$ sudo -u user_name -d database_name -f sql/ddl.sql
```

You can populate the words table with rows with the following:
```
$ npx tsx sql/populate.ts > sql/dml.sql
$ sudo -u user_name -d database_name -f sql/dml.sql
```
The command above populates the words table with random words for the next
200 days. You could instead choose a word each day by doing something like
```
INSERT INTO words SELECT 'your_word_wrapped_in_single_quote', NOW()::date;
```
