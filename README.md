# 🖍️ Crayons API
API for ordering supplies for a classroom built with Sequelize, SQLite, and Express 
<br></br>

<img src="https://storage.googleapis.com/frankie-esparza-portfolio/gifs/crayons.gif" width="500">

## Database Structure 
![Student-Classroom-Supply-db-schema](https://appacademy-open-assets.s3.us-west-1.amazonaws.com/Modular-Curriculum/content/week-11/practices/Student-Classroom-Supply-db-schema.png)

## Usage
### 🏫 GET /classrooms/:id

Get details about the classroom
- `overloaded` boolean showing if classroom is overloaded (i.e. student count is higher than ideal student limit)
- `averageGrade` average grade of the students in the classroom
- `studentCount` number of students
- `supplyCount` number of supplies

**Example response**
```json
{
  "id": 4,
  "name": "Mr. Mitiguy",
  "studentLimit": 22,
  "Supplies": [
    {
      "id": 79,
      "name": "Highlighter - Yellow",
      "category": "Correcting",
      "handed": null
    },
  ],
  "Students": [
    {
      "firstName": "Michael",
      "lastName": "Flynn"
    }
  ],
  "supplyCount": 16,
  "averageGrade": [
    {
      "studentId": 4,
      "classroomId": 4,
      "grade": 4,
      "createdAt": "2024-06-19T02:48:18.791Z",
      "updatedAt": "2024-06-19T02:48:18.791Z",
      "averageGrade": 3.11111111111111,
      "studentCount": 27
    }
  ],
  "overloaded": false
}
```

### 🎒 GET /supplies/category/:categoryName
Get supplies related to a specific task e.g. 'Gluing', 'Cutting', 'Pasting', or 'Correcting'

**Example request**
```
/supplies/category/Writing
```

**Example response**
```js
[
  {
    "name": "Mechanical Pencil",
    "Classroom": null
  },
  {
    "name": "#2 Pencil",
    "Classroom": {
      "id": 16,
      "name": "Ms. Johnson"
    }
  },
  ...
]
```


### 📚 Pagination
Specify the number of results you want to fetch using query params
- `page` where to fetch
- `size` number of results to fetch

Returns results and pagination info
- `count` total number of results returned
- `page` current page
- `pageCount` total number of pages

**Example request**
```
/students?page=1&size=5
```

**Example response**
```json
{
  "count": 267,
  "rows": [
    {
      "id": 2,
      "firstName": "Temilade",
      "lastName": "Openiyi",
      "leftHanded": false,
      "Classrooms": [
        {
          "id": 5,
          "name": "Ms. Adu",
          "StudentClassroom": {
            "grade": 4
       }
        }
      ]
    }
  ],
  "page": "1",
  "pageCount": 89
}
```

## Setup 
Install SQLite and Sequelize
- `cd server`
- `npm install -D dotenv-cli sqlite3`
- `npm install dotenv sequelize sequelize-cli`

Setup and seed database
- create a `/server/.env` file following the .env.example file 
- `npx dotenv sequelize db:migrate`
- `npx dotenv sequelize db:seed:all`

To check that the data was migrated & seeded correctly: 
- `sqlite3 db/dev.db`
- `.tables`
- `.schema Supplies`

To view the responses locally:
- `npm start`
- `http://localhost:8000/`
