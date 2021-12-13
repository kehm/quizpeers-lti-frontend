import axios from 'axios';

/**
 * Check if user is an instructor
 *
 * @returns {boolean} True if instructur
 */
const isInstructor = async () => {
    try {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/instructor`,
            {},
            { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
        );
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * Check if user is a learner
 *
 * @returns {boolean} True if learner
 */
const isLearner = async () => {
    try {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/learner`,
            {},
            { timeout: process.env.REACT_APP_HTTP_TIMEOUT },
        );
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * Get user role
 *
 * @returns {Array} User roles
 */
const getUserRole = async () => {
    const role = [false, false];
    role[0] = await isInstructor();
    role[1] = await isLearner();
    return role;
};

export default getUserRole;
