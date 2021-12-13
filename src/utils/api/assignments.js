import axios from 'axios';
import parseGlossary from '../parse-glossary';

/**
 * Launch assignment
 *
 * @param {int} id Assignment ID
 */
export const launchAssignment = async (id) => {
    const resource = await axios.post(
        `${process.env.REACT_APP_API_URL}/launch/resource`,
        { id },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    window.location.href = resource.data.location;
};

/**
 * Get student assignment
 *
 * @param {int} id Assignment ID
 * @returns {Object} Assignment
 */
export const getAssignment = async (id) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/assignments/${id}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get all task assignments for the course
 *
 * @returns {Array} Assignments
 */
export const getTaskAssignments = async () => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/assignments/type/task`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create a new task assignment
 *
 * @param {Object} assignment Assignment object
 * @param {Object} glossary Glossary file
 * @returns {Object} Assignment
 */
export const createTaskAssignment = async (assignment, glossary) => {
    if (glossary && glossary.length > 0) {
        assignment.glossary = await parseGlossary(glossary[0]);
    }
    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/assignments/task`,
        assignment,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create a new quiz assignment
 *
 * @param {Object} assignment Assignment object
 * @returns {Object} Assignment
 */
export const createQuizAssignment = async (assignment) => {
    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/assignments/quiz`,
        assignment,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Publish/unpublish solution
 *
 * @param {int} assignmentId Assignment ID
 */
export const publishSolution = async (assignmentId) => {
    await axios.post(
        `${process.env.REACT_APP_API_URL}/assignments/publish`,
        { assignmentId },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};
