// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

// Import model(s)
const { Student, Classroom, StudentClassroom, Supply, sequelize } = require('../db/models');
const { Op } = require('sequelize');

// TODO
// Connect pagination middleware
// const middlewares = require('../utils/middlewares');
// router.use(middlewares.paginationHandler);

// List of classrooms
router.get('/', async (req, res, next) => {
    let errorResult = { errors: [], count: 0, pageCount: 0 };
    const where = {};

    if (req.query.name) {
        where.name = {
            [Op.substring]: req.query.name
        }
    }

    if (req.query.studentLimit) {
        if (req.query.studentLimit.indexOf(',') !== -1) {
            let queryParts = req.query.studentLimit.split(',');
            let [min, max] = queryParts;

            if (typeof Number(min) === "number" && typeof Number(max) === "number") {
                where.studentLimit = {
                    [Op.and]: {
                        [Op.gt]: [min],
                        [Op.lt]: [max]
                    }
                }
            } else {
                errorResult.errors.push("Student Limit should be two numbers: min,max");
            }
        } else {
            where.studentLimit = req.query.studentLimit
        }
    }

    const classrooms = await Classroom.findAll({
        attributes: ['id', 'name', 'studentLimit'],
        include: {
            model: StudentClassroom,
            attributes: []
        },
        where,
        order: [['name', 'ASC']],
        group: [['classroomId']],
        attributes: {
            include: [
                [
                    sequelize.fn("AVG", sequelize.col("grade")),
                    "averageGrade"
                ],
                [
                    sequelize.fn("COUNT", sequelize.col("studentId")),
                    "numStudents"
                ],
            ]
        },
    });

    res.json(classrooms);
});

// Single classroom
router.get('/:id', async (req, res, next) => {
    let classroom = await Classroom.findByPk(req.params.id, {
        attributes: ['id', 'name', 'studentLimit'],
        // Phase 7:
        // Include classroom supplies and order supplies by category then
        // name (both in ascending order)

        // Include students of the classroom and order students by lastName
        // then firstName (both in ascending order)

        // (Optional): No need to include the StudentClassrooms
        include: [
            {
                model: Supply,
                attributes: ['id', 'name', 'category', 'handed'],
            },
            {
                model: Student,
                through: { attributes: [] },
                attributes: ['firstName', 'lastName'],
            }
        ]
        ,
        order: [
            [Supply, 'category', 'ASC'],
            [Supply, 'name', 'ASC'],
            [Student, 'lastName', 'ASC'],
            [Student, 'firstName', 'ASC']
        ]
    });

    if (!classroom) {
        res.status(404);
        res.send({ message: 'Classroom Not Found' });
    }

    // Phase 5: Supply and Student counts, Overloaded classroom
    // Phase 5A: Find the number of supplies the classroom has and set it as
    // a property of supplyCount on the response
    let classroomObj = classroom.toJSON();

    classroomObj.supplyCount = await Supply.count({
        where: {
            classroomId: req.params.id
        }
    });

    // Phase 5B: Find the number of students in the classroom and set it as
    // a property of studentCount on the response

    // ===================================
    // TODO -
    // 1) figure out how to remove extra properties
    // 2) increase efficiency - could number of queries be reduced?
    // ===================================

    classroomObj.averageGrade = await StudentClassroom.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn("AVG", sequelize.col("grade")),
                    "averageGrade"
                ],
                [
                    sequelize.fn("COUNT", sequelize.col("grade")),
                    "studentCount"
                ]
            ]
        },
        where: {
            classroomId: req.params.id
        }
    });

    // Phase 5C: Calculate if the classroom is overloaded by comparing the
    // studentLimit of the classroom to the number of students in the
    // classroom
    classroomObj.overloaded = (classroom.studentLimit < classroomObj.studentCount);

    // Optional Phase 5D: Calculate the average grade of the classroom

    res.send(classroomObj);
});

// Export class - DO NOT MODIFY
module.exports = router;
