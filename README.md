# 🖍️ Crayons
A backend API for ordering supplies for a classroom 
<br></br>


## Features 
1. Get `students`, `classrooms`, & `supplies` & order by: 
    - alphabetically 
    - categoryName

2. **Pagination** - return only a subset of the results

3. **Aggregation** - return 
    - total number of results 
    - total number of pages
    - total number of `supplies` or `students` for a particular classroom
    - find if a classroom is `overloaded` with students 
    - get `averageGrade` for a classroom

4. **Filters** 
    - get only students with a certain `first name` or `last name` 
    - get only supplies that are `lefty`
    - 
<br></br>


## Setup 
- `cd server`
- `npm install`
- `npm install -D dotenv-cli sqlite3`
- `npm install dotenv, sequelize, sequelize-cli`
- create a `/server/.env` file following the .env.example file 
- `npx dotenv sequelize db:migrate`
- `npx dotenv sequelize db:seed:all`

To check that the data was migrated & seeded correctly: 
- `sqlite3 db/dev.db`
- `.tables`
- `.schema Supplies`
<br></br>