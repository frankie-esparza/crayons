// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

// Import model(s)
const { Student, Classroom, StudentClassroom, Supply, sequelize } = require('../db/models');
const { Op } = require('sequelize');

// List of classrooms
router.get('/', async (req, res, next) => {
    let errorResult = { errors: [], count: 0, pageCount: 0 };

    // Phase 6B: Classroom Search Filters
    /*
        name filter:
            If the name query parameter exists, set the name query
                filter to find a similar match to the name query parameter.
            For example, if name query parameter is 'Ms.', then the
                query should match with classrooms whose name includes 'Ms.'

        studentLimit filter:
            If the studentLimit query parameter includes a comma
                And if the studentLimit query parameter is two numbers separated
                    by a comma, set the studentLimit query filter to be between
                    the first number (min) and the second number (max)
                But if the studentLimit query parameter is NOT two integers
                    separated by a comma, or if min is greater than max, add an
                    error message of 'Student Limit should be two integers:
                    min,max' to errorResult.errors
            If the studentLimit query parameter has no commas
                And if the studentLimit query parameter is a single integer, set
                    the studentLimit query parameter to equal the number
                But if the studentLimit query parameter is NOT an integer, add
                    an error message of 'Student Limit should be a integer' to
                    errorResult.errors
    */
    const where = {};

    if (req.query.name) {
        where.name = {
            [Op.substring]: req.query.name
        }
    }

    if (req.query.studentLimit) {
        // if studentLimit query contains a comma
        if (req.query.studentLimit.indexOf(',') !== -1) {
            let queryParts = req.query.studentLimit.split(',');
            let [min, max] = queryParts;

            // if both parts of studentLimit query are integers
            if (typeof Number(min) === "number" && typeof Number(max) === "number") {
                where.studentLimit = {
                    [Op.and]: {
                        [Op.gt]: [min],
                        [Op.lt]: [max]
                    }
                }
                // if at least one of queryParts is not an integer
            } else {
                errorResult.errors.push("Student Limit should be two numbers: min,max");
            }
            // if studentLimit query does NOT contain a comma
        } else {
            where.studentLimit = req.query.studentLimit
        }
    }


    const classrooms = await Classroom.findAll({
        attributes: ['id', 'name', 'studentLimit'],
        where,
        // Phase 1B: Order the Classroom search results
        order: [['name', 'ASC']]
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
        // Your code here
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
