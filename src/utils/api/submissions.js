import axios from 'axios';

/**
 * Get existing assignment submission for the user in session
 *
 * @param {int} assignmentId Assignment ID
 * @param {boolean} start Start submission if not already started
 */
export const getSubmission = async (assignmentId, start) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/submissions/assignment/${assignmentId}?start=${start || false}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get quiz tasks with answers and solution
 *
 * @param {int} submissionId Submission ID
 */
export const getQuizTasks = async (submissionId) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/submissions/quiz/${submissionId}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get submissions for the assignment that are either pending evaluations or not published
 *
 * @param {int} assignmentId Assignment ID
 */
export const getPendingSubmissions = async (assignmentId) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/submissions/pending/${assignmentId}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get submissions with published evaluations
 *
 * @param {int} assignmentId Assignment ID
 */
export const getPublishedSubmissions = async (assignmentId) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/submissions/published/${assignmentId}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Save quiz answers
 *
 * @param {int} submissionId Submission ID
 * @param {Array} tasks Tasks with selected answers
 */
export const saveAnswers = async (submissionId, tasks) => {
    await axios.post(
        `${process.env.REACT_APP_API_URL}/submissions/quiz/save/${submissionId}`,
        { tasks },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Submit quiz answers
 *
 * @param {int} submissionId Submission ID
 */
export const submitQuiz = async (submissionId) => {
    await axios.post(
        `${process.env.REACT_APP_API_URL}/submissions/quiz/${submissionId}`,
        {},
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Publish the selected submission results
 *
 * @param {int} assignmentId Assignment ID
 * @param {Array} submissions Submission IDs
 */
export const publishResults = async (assignmentId, submissions) => {
    await axios.post(
        `${process.env.REACT_APP_API_URL}/submissions/publish`,
        {
            assignmentId,
            submissions,
        },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};
