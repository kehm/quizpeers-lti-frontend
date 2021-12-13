import axios from 'axios';
import createFormData from '../create-formdata';

/**
 * Get tasks included for quiz selection from the assignment
 *
 * @param {Array} assignmentIds Assignment IDs
 * @returns {Array} Included tasks
 */
export const getIncludedTasks = async (assignmentIds) => {
    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/tasks/include`,
        { assignmentIds },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get tasks associated with the submission
 *
 * @param {int} submissionId Submission ID
 * @returns {Array} Tasks
 */
export const getSubmittedTasks = async (submissionId) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/tasks/submission/${submissionId}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get solutions for submission tasks
 *
 * @param {string} submissionId Submission ID
 * @returns {Array} Task solutions
 */
export const getTaskSolutions = async (submissionId) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/tasks/solution/${submissionId}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get task groups associated with the assignment
 *
 * @param {int} assignmentId Assignment ID
 * @returns {Array} Task groups
 */
export const getTaskGroups = async (assignmentId) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/tasks/groups/${assignmentId}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Get task groups associated with the assignment
 *
 * @param {Array} groupIds Group IDs
 * @returns {Array} Task group names and IDs
 */
export const getTaskGroupInfo = async (groupIds) => {
    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/tasks/groups`,
        { groupIds },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
    return response.data;
};

/**
 * Create new multiple choice task
 *
 * @param {Object} values Form values
 * @param {int} taskId Task ID to replace (optional)
 * @param {boolean} replace True if replace, false if edit
 */
export const createMultipleChoiceTask = async (values, taskId, replace) => {
    const task = {
        assignmentId: values.assignmentId,
        type: 'MULTIPLE_CHOICE',
        title: values.title,
        description: values.description,
        indexSolution: values.indexSolution,
    };
    if (taskId) {
        task.taskId = taskId;
        task.replace = replace;
        if (values.mediaId) task.mediaId = values.mediaId;
    }
    await axios.post(
        `${process.env.REACT_APP_API_URL}/tasks/multiple-choice`,
        createFormData(
            task,
            values.image,
            values.options,
        ),
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Set term files
 *
 * @param {Object} pair Term pair
 * @param {string} name Term name
 * @param {Array} files File array
 * @param {int} counter Counter
 */
const setTermFile = (pair, name, files, counter) => {
    if (pair[name].type === 'IMAGE' && pair[name].term[0]) {
        files.push(pair[name].term[0]);
        pair[name].term = counter;
        counter += 1;
    }
    return counter;
};

/**
 * Create new combine terms task
 *
 * @param {Object} values Form values
 * @param {int} taskId Task ID to replace (optional)
 * @param {boolean} replace True if replace, false if edit
 */
export const createCombineTermsTask = async (values, taskId, replace) => {
    const tmpValues = { ...values };
    const task = {
        assignmentId: tmpValues.assignmentId,
        type: 'COMBINE_TERMS',
        title: tmpValues.title,
        description: tmpValues.description,
    };
    if (taskId) {
        task.taskId = taskId;
        task.replace = replace;
    }
    const files = [];
    let counter = 0;
    tmpValues.termPairs.forEach((pair) => {
        counter = setTermFile(pair, 'term', files, counter);
        counter = setTermFile(pair, 'relatedTerm', files, counter);
    });
    await axios.post(
        `${process.env.REACT_APP_API_URL}/tasks/combine-terms`,
        createFormData(
            task,
            files,
            tmpValues.termPairs.map((pair) => JSON.stringify(pair)),
        ),
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Create new name image task
 *
 * @param {Object} values Form values
 * @param {int} taskId Task ID to replace (optional)
 * @param {boolean} replace True if replace, false if edit
 */
export const createNameImageTask = async (values, taskId, replace) => {
    const task = {
        assignmentId: values.assignmentId,
        type: 'NAME_IMAGE',
        title: values.title,
        description: values.description !== '' ? values.description : null,
        solution: values.nameSolution,
    };
    if (taskId) {
        task.taskId = taskId;
        task.replace = replace;
        if (values.mediaId) task.mediaId = values.mediaId;
    }
    await axios.post(
        `${process.env.REACT_APP_API_URL}/tasks/name-image`,
        createFormData(
            task,
            values.image,
        ),
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Create new task group
 *
 * @param {string} name Group name
 * @param {string} description Group description
 * @param {int} assignmentId Assignment ID
 */
export const createTaskGroup = async (name, description, assignmentId) => {
    await axios.post(
        `${process.env.REACT_APP_API_URL}/tasks/group`,
        {
            name,
            description: description !== '' ? description : undefined,
            assignmentId,
        },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Submit task evaluation
 *
 * @param {int} taskId Task ID
 * @param {int} submissionId The ID of the submission that the task belongs to
 * @param {int} score Score
 * @param {boolean} include True if the task should be included in quiz selection
 * @param {int} groupId Task group ID (optional)
 */
export const evaluateTask = async (taskId, submissionId, score, include, groupId) => {
    await axios.post(
        `${process.env.REACT_APP_API_URL}/tasks/evaluate/${taskId}`,
        {
            submissionId,
            score: score === null ? undefined : score,
            include,
            groupId: groupId === null ? undefined : groupId,
        },
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};

/**
 * Delete task edit
 *
 * @param {int} taskId Task ID
 */
export const deleteTaskEdit = async (taskId) => {
    await axios.delete(
        `${process.env.REACT_APP_API_URL}/tasks/edit/${taskId}`,
        { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
    );
};
