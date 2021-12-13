import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import LanguageContext from '../../context/LanguageContext';
import Tasks from './Tasks';
import Quiz from './Quiz';
import Solution from './Solution';
import { getAssignment } from '../../utils/api/assignments';

/**
 * Render assignment for student
 */
const Assignment = () => {
    const { language } = useContext(LanguageContext);
    const { id } = useParams();
    const [assignment, setAssignment] = useState(undefined);
    const [expired, setExpired] = useState(false);
    const [error, setError] = useState(undefined);

    /**
     * Get assignment from API
     */
    useEffect(() => {
        if (!assignment) {
            const getFromAPI = async () => {
                try {
                    const tmpAssignment = await getAssignment(id);
                    setAssignment(tmpAssignment);
                    if (tmpAssignment.status !== 'STARTED') setExpired(true);
                } catch (err) {
                    if (err.response && err.response.status === 404) {
                        setError(language.dictionary.errorNoAssignment);
                    } else setExpired(true);
                }
            };
            getFromAPI();
        }
    }, [id, assignment]);

    /**
     * Render quiz or task assignment
     *
     * @returns JSX
     */
    const renderAssignment = () => {
        if (!assignment) return null;
        if (assignment.type === 'TASK_SUBMISSION') {
            return (
                <Tasks
                    assignment={assignment}
                    onExpired={() => setExpired(true)}
                />
            );
        }
        return (
            <Quiz
                assignment={assignment}
                onExpired={() => setExpired(true)}
            />
        );
    };

    return (
        <div className="p-4 rounded max-w-xl m-auto">
            {expired ? (
                <>
                    <p>{language.dictionary.assignmentExpired}</p>
                    {assignment && assignment.status === 'PUBLISHED_WITH_SOLUTION' && <Solution assignment={assignment} />}
                </>
            ) : renderAssignment()}
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
};

export default Assignment;
