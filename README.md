# Movie Academy project (Movie Rating System)

### Step to set this project:

1. Create Postgres database naming it (movies_db)
2. Create User role for login this database:
      - username: `movie_admin`
      - password: `123456`
   
   then provide this user role to login for this database:
   
   * log to super user on postgres (Run `psql postgres -U "super user"`)
   * connect to database
   * provide access to user (Run `ALTER ROLE movie_admin WITH LOGIN;`)
   * Run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
3. Run `yarn install or npm install`
4. Then run `yarn typeorm migration:run` command
5. Run `yarn dev` command

repo: https://github.com/kimlyNhep/movie-server.git
