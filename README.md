# 🖍️ Crayons
A backend API for ordering supplies for a classroom built with Sequelize, SQLite, and Express 
<br></br>

## Features 
- Give me a list of all students, classrooms, or supplies
    - show me everything at once
    - show me 10 at a time 

- Give me details about a particular classroom: 
    - How many students are in the classroom? 
    - Does a classroom have too high of a student-to-teacher ratio?
    - What's the average grade of students in the classroom? 

- Give me details about supplies to help me order the correct amount for my class: 
    - How many left-handed scissors do I need? how many do I have?
    - Show me a list of all of the supplies that I have that are writing tools.
<br></br>


## Database Structure 
![Student-Classroom-Supply-db-schema](https://appacademy-open-assets.s3.us-west-1.amazonaws.com/Modular-Curriculum/content/week-11/practices/Student-Classroom-Supply-db-schema.png)
<br></br>


## Setup 
- `cd server`
- `npm install -D dotenv-cli sqlite3`
- `npm install dotenv sequelize sequelize-cli`
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
<br></br>

## Usage
### Get classroom details
Returns the following aggregated info about each classroom: 
- `overloaded` - boolean showing if classroom is overloaded (i.e. student count is higher than ideal student limit)
- `averageGrade` - average grade of the students in the classroom
- `studentCount` - number of students
- `supplyCount` - number of supplies

Endpoint: 
```
/classrooms/:id
```

Example Response (abbreviated):
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
    }
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

### Specify the number of results (pagination)
- `count` - the total number of results for the query
- `page` tells you the current page 
- `pageCount` tells you the total number of pages 

Example Endpoint: 
```
/students?page=1&size=5
```

Example Response (abbreviated):
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

### Get supplies by category
- get all of the supplies related to a specific task 
- `categoryName` - 'Gluing', 'Cutting', 'Pasting', or 'Correcting'

Endpoint: 
```
/supplies/category/:categoryName
```

Example Response (abbreviated):
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
  }
]
```
