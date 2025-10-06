const Model = require("../models");
const { logger } = require("../Logs/logger.js");
const { successResponse, failureResponse } = require("../utils/response.js");
const { CLASSROOM_STATUS } = require("../utils/enumTypes.js");
const jwt = require("../utils/jwt.js");
const { Op, fn, col, literal, where } = require("sequelize");
// @ts-ignore
const { Invite_token, sequelize } = require("../models/index.js");
const schoolService = require("../services/school-service.js");
const {
  handleInternalServerError,
  handleSuccessResponse,
  handleErrorResponse,
} = require("../utils/response-handlers.js");
const ROLES = require("../models/roles");
const standard = require("../models/standard");

const createSchool = async (req, res) => {
  const token = req.params.token;

  try {
    const existingToken = await Invite_token.findOne({
      where: { token },
    });

    if (!existingToken) {
      return handleErrorResponse(
        res,
        400,
        "Access denied, your token is invalid"
      );
    }

    const result = jwt.verifyAccessToken(token);

    if (!result.success) {
      if (result.error === "Token expired") {
        await existingToken.destroy();
        return handleErrorResponse(res, 403, "Token expired");
      } else {
        return handleErrorResponse(res, 500, "Token verification failed");
      }
    }

    const transaction = await Model.sequelize.transaction();

    try {
      const { name, email, password, schoolName } = req.body;

      const existingUser = await Model.User.findOne({
        where: { email },
        transaction,
      });

      if (existingUser) {
        await transaction.rollback();
        return handleErrorResponse(res, 200, "User already exists");
      }

      const school = await Model.School.create(
        { name: schoolName },
        { transaction }
      );

      const user = await Model.User.create(
        {
          name,
          email,
          password: password,
          school_id: school.id,
          role: "school",
        },
        { transaction }
      );

      await transaction.commit();
      await existingToken.destroy();

      return successResponse(res, 200, "User and School created successfully");
    } catch (error) {
      await transaction.rollback();
      return failureResponse(res, 500, error.message);
    }
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const schoolDashboard = async (req, res) => {
  try {
    const { schoolId } = req.query;

    if (!schoolId) {
      return failureResponse(res, 400, "Missing Required Fields");
    }

    // const { schoolId, userId } = req.query;

    // if (!schoolId || !userId) {
    //   return failureResponse(res, 400, "Missing Required Fields");
    // }

    const totalStudentCount = await Model.User.count({
      where: {
        school_id: schoolId,
        role: ROLES.STUDENT,
      },
    });

    const totalClassroomCount = await Model.Classroom.count({
      where: {
        schoolId: schoolId,
      },
    });

    const getSchoolTeacher = await Model.User.findAll({
      attributes: ["id", "name", "email", "role", "image"],
      where: {
        school_id: schoolId,
        role: "teacher",
      },
      limit: 4,
    });

    // const getSchoolTickets = await Model.Ticket.findAll({
    //   where: {
    //     submitted_by: userId,
    //   },
    //   include: [
    //     {
    //       model: Model.User,
    //       attributes: ["name"],
    //     },
    //   ],
    // });

    // Current date for comparison
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const currentClassStandardsWeightagesQuery = await sequelize.query(`
        SELECT
            c.id AS classroom_Id,
            SUM(du."weightage") / NULLIF(COUNT(DISTINCT cc."standardId"), 0) AS avg_class_weightage,  -- Average weightage per standard in the classroom
            MIN((cc."startDate"::date + du."accessibleDay" * interval '1 day')::date) AS earliest_accessible_date,  -- Earliest accessible date in the group
            MAX((cc."startDate"::date + du."accessibleDay" * interval '1 day')::date) AS latest_accessible_date  -- Latest accessible date in the group
        FROM
            public."Classrooms" c
        INNER JOIN
            public."ClassroomCourses" cc
            ON c.id = cc."classroomId"
        INNER JOIN
            public."DailyUploads" du
            ON du."standardId" = cc."standardId"
        LEFT JOIN
            public."AssessmentResourcesDetails" ard
            ON ard."resourceId" = du."resourceId"
        LEFT JOIN
            public."Videos" v
            ON v."resourceId" = du."resourceId"
        WHERE
            c."status" = 'active'
            AND (cc."startDate"::date + du."accessibleDay" * interval '1 day')::date < '${formattedDate}'
            AND du."weightage" > 0
            AND c."schoolId" = '${schoolId}'
        GROUP BY
            c.id;
        `);

    // Calculate the total weightage for all classes
    const currentTotalWeightage =
      currentClassStandardsWeightagesQuery[0].reduce((acc, item) => {
        return acc + parseFloat(item.avg_class_weightage); // Convert string to number and accumulate
      }, 0);

    const schoolClassroomsCount = await Model.Classroom.count({
      where: {
        schoolId: schoolId,
        status: CLASSROOM_STATUS.ACTIVE,
      },
    });

    const currentAvgWeightage =
      schoolClassroomsCount > 0
        ? currentTotalWeightage / schoolClassroomsCount
        : 0;

    const classroomsStudentResults = await sequelize.query(`
      SELECT
          e."classroomId" AS classroom_id,
          ROUND(AVG(e.result)::numeric, 2) AS avg_result
      FROM
          public."Enrollments" e
      INNER JOIN
          public."Classrooms" c
          ON e."classroomId" = c.id
      WHERE
          c."status" = 'active'
      GROUP BY
          e."classroomId";
    `);

    const totalClassroomsResults = classroomsStudentResults[0].reduce(
      (acc, item) => {
        return acc + item.avg_result || 0;
      },
      0
    );

    const currentAvgResult =
      schoolClassroomsCount > 0
        ? totalClassroomsResults / schoolClassroomsCount
        : 0;

    const users = await Model.User.findAll({});

    const userCountData = await Model.User.findAll({
      attributes: [
        [fn("date_trunc", "year", col("createdAt")), "year"],
        [fn("date_trunc", "month", col("createdAt")), "month"],
        [fn("count", "*"), "count"],
      ],
      group: ["year", "month"],
      order: [
        [literal("date_trunc('year', \"createdAt\")"), "ASC"],
        [literal("date_trunc('month', \"createdAt\")"), "ASC"],
      ],
      where: {
        school_id: schoolId,
      },
      raw: true,
    });

    // Transform the data into the desired format
    const formattedResults = userCountData.map((row) => ({
      year: new Date(row.year).getFullYear(),
      month: new Date(row.month).getMonth() + 1, // Months are 0-indexed in JavaScript
      count: parseInt(row.count, 10),
    }));

    // Calculate cumulative count
    let cumulativeCount = 0;
    const cumulativeResults = formattedResults.map((row) => {
      cumulativeCount += row.count;
      return {
        year: row.year,
        month: row.month,
        count: cumulativeCount,
      };
    });

    const response = {
      totalStudent: totalStudentCount,
      totalClassroom: totalClassroomCount,
      getSchoolTeacher: getSchoolTeacher,
      // getSchoolTickets: getSchoolTickets,
      totalWeightage: parseFloat(currentAvgWeightage.toFixed(2)),
      obtainedWeightage: parseFloat(currentAvgResult.toFixed(2)),
      usersJoining: cumulativeResults,
      usersCount: users.length,
    };

    return successResponse(
      res,
      200,
      "User and School created successfully",
      response
    );
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const createTicket = async (req, res) => {
  try {
    const { userId, complaintType, message } = req.body;

    if (!userId || !complaintType || !message) {
      return successResponse(res, 400, "Missing required Fields");
    }

    const ticket = await Model.Ticket.create({
      complaint_type: complaintType,
      message,
      submitted_by: userId,
      status: "active",
    });

    return successResponse(res, 200, "Ticket created successfully", ticket);
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const updateTicket = async (req, res) => {
  try {
    const { complaintType, message, status, ticketId } = req.body;

    if (!ticketId) {
      return successResponse(res, 400, "Missing required Fields");
    }

    const ticket = await Model.Ticket.findByPk(ticketId);

    if (!ticket) {
      return failureResponse(res, 404, "Ticket not found");
    }

    ticket.complaint_type = complaintType || ticket.complaint_type;
    ticket.message = message || ticket.message;
    ticket.status = status || ticket.status;

    await ticket.save();

    return successResponse(res, 200, "Ticket updated successfully", ticket);
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.query;

    if (!ticketId) {
      return successResponse(res, 400, "Missing required Fields");
    }
    const ticket = await Model.Ticket.findByPk(ticketId);

    if (!ticket) {
      return failureResponse(res, 404, "Ticket not found");
    }

    await ticket.destroy();

    return successResponse(res, 200, "Ticket deleted successfully");
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.query;

    const ticket = await Model.Ticket.findOne({
      where: {
        id: ticketId,
      },
      include: [
        {
          model: Model.User,
          attributes: ["name"],
        },
      ],
    });

    if (!ticket) {
      return failureResponse(res, 404, "Ticket not found");
    }

    return successResponse(res, 200, "Ticket retrieved successfully", ticket);
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const listTickets = async (req, res) => {
  try {
    const { userId } = req.query;

    const tickets = await Model.Ticket.findAll({
      where: {
        submitted_by: userId,
      },
      include: [
        {
          model: Model.User,
          attributes: ["name"],
        },
      ],
    });

    // console.log(tickets);

    return successResponse(res, 200, "Tickets retrieved successfully", tickets);
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const getAllSchools = async (req, res) => {
  try {
    const reply = await schoolService.getAllSchools();

    if (reply.code == 200) {
      return handleSuccessResponse(res, 200, reply.data);
    } else {
      return handleInternalServerError(res);
    }
  } catch (error) {
    logger.error(
      error?.message || "An error occurred, but no error message was provided"
    );
    return handleInternalServerError(res);
  }
};

const listTeacher = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let { schoolId } = req.query;

    if (!schoolId) {
      return successResponse(res, 200, "Missing required Failed");
    }

    let filterCriteria = {};

    if (schoolId) {
      filterCriteria.school_id = schoolId;
      filterCriteria.role = ROLES.TEACHER;
    }

    const offset = (page - 1) * limit;

    // Apply search filter
    if (req.query.search) {
      const searchCriteria = {
        [Op.iLike]: `%${req.query.search}%`,
      };
      filterCriteria = {
        ...filterCriteria,
        [Op.or]: [{ name: searchCriteria }, { email: searchCriteria }],
      };
    }

    // Total count with filtrations
    const totalCount = await Model.User.count({ where: filterCriteria });

    // const teachers = await Model.Classroom.findAll({
    //   attributes: [
    //     [
    //       Sequelize.fn("COUNT", Sequelize.col("Classroom.id")),
    //       "classroomCount",
    //     ],
    //   ],
    //   include: [
    //     {
    //       model: Model.User,
    //       attributes: ["id", "name", "email", "image"],
    //       where: filterCriteria,
    //       required: true
    //     },
    //   ],
    //   required: true,
    //   group: ["User.id"],
    //   limit: limit,
    //   offset: offset,
    // });

    // First, get the teachers
    const teachers = await Model.User.findAll({
      attributes: ["id", "name", "email", "image"],
      where: filterCriteria,
      limit: limit,
      offset: offset,
    });

    // Then, for each teacher, get the count of classrooms
    for (let teacher of teachers) {
      const classroomCount = await Model.Classroom.count({
        where: { teacherId: teacher.id },
      });
      teacher.dataValues.classroomCount = classroomCount; // Add the count to the teacher object
    }

    const transformedData = teachers?.map((user) => ({
      classroomCount: user.dataValues.classroomCount.toString(),
      User: {
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
        image: user.dataValues.image,
      },
    }));

    const totalPages = Math.ceil(totalCount / limit);

    const pagination = {
      currentPage: page,
      limit: limit,
      totalCount: totalCount,
      totalPages: totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };

    const response = {
      teachers: transformedData || [],
      pagination,
    };
    return successResponse(res, 200, "Teachers fetched successfully", response);
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const getTeacher = async (req, res) => {
  try {
    let { teacherId } = req.query;
    const { school_id } = req.user;
    if (!teacherId) {
      return successResponse(res, 400, "Missing Required Fields");
    }

    const teachers = await Model.Classroom.findAll({
      include: [
        {
          model: Model.ClassroomCourses,
          attributes: ["standardId"],
          as: "classroomCourses",
        },
        {
          model: Model.User,
          attributes: ["id", "name", "email", "image", "school_id"],
          where: {
            id: teacherId,
          },
        },
      ],
    });

    let classrooms = [];
    classrooms = await Model.Classroom.findAll({
      where: {
        schoolId: school_id,
        status: CLASSROOM_STATUS.ACTIVE,
      },
    });

    const response = {
      teachers,
      classrooms,
    };

    return successResponse(res, 200, "Teachers fetched successfully", response);
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const deleteTeacher = async (req, res) => {
  try {
    let { teacherId } = req.query;

    if (!teacherId) {
      return successResponse(res, 400, "Missing Required Fields");
    }

    const deletedCount = await Model.User.destroy({
      where: {
        id: teacherId,
      },
    });

    if (deletedCount === 0) {
      return successResponse(res, 404, "Teacher not found");
    }

    return successResponse(res, 200, "Teacher deleted successfully", {
      deletedCount,
    });
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const inviteTeacher = async (req, res) => {
  try {
    let { teacherId } = req.query;

    if (!teacherId) {
      return successResponse(res, 400, "Missing Required Fields");
    }

    return successResponse(res, 200, "Email has been send  successfully");
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const getSchoolCourses = async (req, res) => {
  try {
    let { schoolId, teacherId } = req.query;

    const teacherCondition = teacherId ? { id: teacherId } : {};

    const course = await Model.Classroom.findAll({
      attributes: ["id"],
      include: [
        {
          model: Model.ClassroomCourses,
          as: "classroomCourses",
          attributes: ["standardId"],
          include: [
            {
              model: Model.Standard,
              as: "standard",
            },
          ],
        },
        {
          model: Model.User,
          where: teacherCondition,
        },
      ],
      where: {
        schoolId: schoolId,
      },
    });

    const standardsSet = new Map();

    course?.forEach((classItem) => {
      classItem?.classroomCourses?.forEach((course) => {
        const standard = course.standard;
        if (standard && !standardsSet.has(standard.id)) {
          standardsSet.set(standard.id, standard);
        }
      });
    });

    const transformedData = {
      standards: Array.from(standardsSet.values()),
    };

    return successResponse(
      res,
      200,
      "Data fetch successfully",
      transformedData
    );
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const getResourceDetail = async (req, res) => {
  try {
    let { standardId, resourceType, search } = req.query;

    // Dynamically construct the include array based on resourceType
    let resourceInclude = [];
    const resourceFilter = {};

    // Ensure 'search' is an array if provided
    if (search) {
      if (typeof search === "string") {
        search = [search];
      }
      // Wrap each search term with wildcards for partial matching
      const searchTerms = search.map((term) => `%${term}%`);
      resourceFilter.name = { [Op.iLike]: { [Op.any]: searchTerms } };
    }

    if (resourceType === "video") {
      resourceInclude.push({
        model: Model.Video,
        as: "video",
        required: true,
      });
    } else if (resourceType === "assessment") {
      resourceInclude.push({
        model: Model.AssessmentResourcesDetail,
        as: "AssessmentResourcesDetail",
        required: true,
      });
    } else {
      resourceInclude.push(
        {
          model: Model.Video,
          as: "video",
        },
        {
          model: Model.AssessmentResourcesDetail,
          as: "AssessmentResourcesDetail",
        }
      );
    }

    const courseDetail = await Model.Standard.findAll({
      attributes: ["id"],
      include: [
        {
          model: Model.DailyUpload,
          as: "dailyUploads",
          attributes: ["id"],
          include: [
            {
              model: Model.Resource,
              as: "resource",
              required: true,
              attributes: ["id", "name", "url", "type", "topic", "status"],
              where: resourceFilter,
              include: resourceInclude,
            },
          ],
          required: true,
        },
      ],
      where: {
        id: standardId,
      },
    });

    return successResponse(res, 200, "Data fetched successfully", courseDetail);
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

const getResourceResult = async (req, res) => {
  try {
    let { resourceId, schoolId, teacherId, courseId } = req.query;

    let teacher = {};

    if (teacherId) {
      teacher = await Model.User.findOne({
        where: {
          id: teacherId,
        },
      });

      if (!teacher) {
        return failureResponse(res, 404, "Teacher Not Found");
      }
    }

    const courseDetail = await Model.Resource.findAll({
      // attributes: ["id"],
      include: [
        {
          model: Model.Video,
          as: "video",
          include: [
            {
              model: Model.Question,
              as: "questions",
              include: [
                {
                  model: Model.VideoQuestionAnswer,
                  as: "answers",
                  separate: true,
                  where: {
                    standardId: courseId,
                  },
                  include: [
                    {
                      model: Model.User,
                      as: "user",
                      where: {
                        school_id: schoolId,
                      },
                      include: teacherId
                        ? [
                            {
                              model: Model.ClassroomStudent,
                              attributes: ["id", "classroomId", "studentId"],
                              required: true,
                              include: {
                                model: Model.Classroom,
                                as: "classroom",
                                attributes: ["id", "teacherId"],
                                where: {
                                  teacherId: teacherId,
                                },
                              },
                            },
                          ]
                        : [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Model.AssessmentResourcesDetail,
          as: "AssessmentResourcesDetail",
          attributes: ["id", "totalMarks"],
          include: [
            {
              model: Model.AssessmentAnswer,
              as: "assessmentAnswers",
              attributes: ["id", "obtainedMarks", "answerURL"],
              where: {
                standardId: courseId,
              },
              separate: true,
              include: [
                {
                  model: Model.User,
                  as: "user",
                  attributes: ["id", "name", "email", "image"],
                  where: {
                    school_id: schoolId,
                  },
                  include: teacherId
                    ? [
                        {
                          model: Model.ClassroomStudent,
                          attributes: ["id", "classroomId", "studentId"],
                          required: true,
                          include: {
                            model: Model.Classroom,
                            as: "classroom",
                            attributes: ["id", "teacherId"],
                            where: {
                              teacherId: teacherId,
                            },
                          },
                        },
                      ]
                    : [],
                },
              ],
            },
          ],
        },
      ],
      where: {
        id: resourceId,
      },
    });

    const result = courseDetail.map((resource) => {
      let totalObtainedMarks = 0;
      let totalPossibleMarks = 0;
      let totalAssessmentAnswers = 0;
      let totalObtainedAverage = 0;

      if (resource.video) {
        resource.video.questions.forEach((question) => {
          let totalObtainedMarksOfOneQuestion = 0;
          let totalAnswersOfOneQuestion = 0;

          question.answers.forEach((answer) => {
            const obtainedMarks = Math.max(answer.obtainedMarks, 0);
            totalObtainedMarksOfOneQuestion += obtainedMarks;
            totalAnswersOfOneQuestion += 1;
          });

          totalPossibleMarks += question.totalMarks;
          totalObtainedAverage +=
            totalAnswersOfOneQuestion > 0
              ? totalObtainedMarksOfOneQuestion / totalAnswersOfOneQuestion
              : 0;
        });
      }

      if (resource.AssessmentResourcesDetail) {
        resource.AssessmentResourcesDetail.assessmentAnswers.forEach(
          (answer) => {
            const obtainedMarks = Math.max(answer.obtainedMarks, 0);
            totalObtainedMarks += obtainedMarks;
            totalAssessmentAnswers += 1;
          }
        );
        totalPossibleMarks = resource.AssessmentResourcesDetail.totalMarks;
        totalObtainedAverage +=
          totalAssessmentAnswers > 0
            ? totalObtainedMarks / totalAssessmentAnswers
            : 0;
      }

      return {
        ...resource.toJSON(),
        averageObtainedMarks: totalObtainedAverage,
        totalMarks: totalPossibleMarks,
        teacher: {
          id: teacher.id || "",
          name: teacher.name || "",
        },
      };
    });

    return successResponse(res, 200, "Data fetched successfully", result);
  } catch (error) {
    console.log("\n\n\n ", error);
    return failureResponse(res, 500, error.message);
  }
};

const getAllTeacher = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let { schoolId } = req.query;

    if (!schoolId) {
      return successResponse(res, 200, "Missing required Failed");
    }

    // First, get the teachers
    const teachers = await Model.User.findAll({
      attributes: ["id", "name"],
      where: {
        school_id: schoolId,
      },
      raw: true,
    });

    return successResponse(res, 200, "Teachers fetched successfully", teachers);
  } catch (error) {
    return failureResponse(res, 500, error.message);
  }
};

module.exports = {
  createSchool,
  schoolDashboard,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketById,
  getAllSchools,
  listTickets,
  listTeacher,
  getTeacher,
  deleteTeacher,
  inviteTeacher,
  getSchoolCourses,
  getResourceDetail,
  getResourceResult,
  getAllTeacher,
};
