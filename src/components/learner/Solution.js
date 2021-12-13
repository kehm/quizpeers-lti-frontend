import React, { useContext, useEffect, useState } from 'react';
import LanguageContext from '../../context/LanguageContext';
import { getSubmission } from '../../utils/api/submissions';
import { getTaskSolutions } from '../../utils/api/tasks';
import Summary from '../components/Summary';

/**
 * Render quiz solution
 */
const Solution = ({ assignment }) => {
    const { language } = useContext(LanguageContext);
    const [submission, setSubmission] = useState(undefined);
    const [solution, setSolution] = useState(undefined);

    /**
     * Get quiz submission
     */
    useEffect(() => {
        if (!submission) {
            const getQuizSubmission = async () => {
                const tmpSubmission = await getSubmission(
                    assignment.id || assignment.assignment_id,
                );
                const tmpSolutions = await getTaskSolutions(tmpSubmission.id);
                setSubmission(tmpSubmission);
                setSolution(tmpSolutions);
            };
            getQuizSubmission();
        }
    }, [submission]);

    return (
        submission ? (
            <>
                <p className="text-blue-600 font-bold py-8">
                    {`${language.dictionary.labelStudentScore} ${submission.lmsScore}`}
                </p>
                <Summary
                    tasks={submission.tasks}
                    maxPoints={assignment.points}
                    solution={solution}
                />
            </>
        ) : null
    );
};

export default Solution;
