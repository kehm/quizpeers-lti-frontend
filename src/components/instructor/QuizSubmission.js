import React, { useContext, useEffect, useState } from 'react';
import LanguageContext from '../../context/LanguageContext';
import Summary from '../components/Summary';
import { getQuizTasks } from '../../utils/api/submissions';

/**
 * Render quiz submission summary and score
 */
const QuizSubmission = ({ submission }) => {
    const { language } = useContext(LanguageContext);
    const [tasks, setTasks] = useState(undefined);
    const [error, setError] = useState(undefined);

    /**
     * Get tasks for submission
     */
    useEffect(() => {
        if (!tasks) {
            const getTasks = async () => {
                try {
                    const tmpTasks = await getQuizTasks(submission.id);
                    setTasks(tmpTasks);
                } catch (err) {
                    setError(language.dictionary.internalAPIError);
                }
            };
            getTasks();
        }
    }, [tasks, submission]);

    return (
        <>
            <p className="text-blue-600 font-bold mt-8 mb-12">
                {`${language.dictionary.labelStudentScore} ${submission.lms_score}`}
            </p>
            {error && <p className="text-red-600 mb-8">{error}</p>}
            {tasks && (
                <Summary
                    tasks={tasks}
                    maxPoints={submission.assignment.points}
                    isTeacher
                />
            )}
        </>
    );
};

export default QuizSubmission;
