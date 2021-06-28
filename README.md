# Movie Academy project (Movie Rating System)

Step to set this project:

1. Create Postgres database naming it (movies_db)
2. Create User role for login this database
   -> username: movie_admin
   -> password: 123456
   then provide this user role to login for this database:
   1/. log to super user on postgres (Run `psql postgres -U "super user"`)
   2/. connect to database
   3/. provide access to user (Run `ALTER ROLE movie_admin WITH LOGIN;`)
   4/. Run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
3. Then run `yarn typeorm migration:run` command
4. Run `yarn dev` command
