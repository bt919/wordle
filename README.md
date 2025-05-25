# wordle clone

## database
This project uses a postgresql database. you can run the ddl against your
local postgres db by first doing
```
cd backend 
```
and then running the following (replace user_name and database_name):
```
sudo -u user_name -d database_name -f sql/ddl.sql
```

You can populate the words table using sql/populate.ts with this command:
```
npx tsx sql/populate.ts > sql/dml.sql
```
and then run:
```
sudo -u user_name -d database_name -f sql/dml.sql
```
