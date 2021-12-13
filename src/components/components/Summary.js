import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';
import MultipleChoiceTask from './MultipleChoiceTask';
import CombineTermsTask from './CombineTermsTask';
import NameImageTask from './NameImageTask';

/**
 * Render a quiz summary that shows the student´s selected answers
 */
const Summary = ({
    tasks, maxPoints, isTeacher, solution,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render multiple choice or combine terms task
     *
     * @param task Task
     * @returns JSX
     */
    const renderTask = (assignmentTask) => {
        let taskSolution;
        if (solution) {
            taskSolution = solution.find(
                (element) => parseInt(element.id, 10) === assignmentTask.task.id,
            ).solution;
        }
        if (assignmentTask.task.type === 'MULTIPLE_CHOICE') {
            return (
                <MultipleChoiceTask
                    task={assignmentTask.task}
                    value={assignmentTask.answer}
                    isCorrect={assignmentTask.answer !== undefined
                        && (assignmentTask.answer === assignmentTask.solution
                            || assignmentTask.answer === taskSolution)}
                    answerOnly
                    solution={taskSolution}
                    isTeacher={isTeacher}
                />
            );
        }
        if (assignmentTask.task.type === 'COMBINE_TERMS') {
            return (
                <CombineTermsTask
                    task={assignmentTask.task}
                    values={assignmentTask.answer}
                    solution={assignmentTask.solution || taskSolution}
                    isTeacher={isTeacher}
                />
            );
        }
        if (assignmentTask.task.type === 'NAME_IMAGE') {
            return (
                <NameImageTask
                    task={assignmentTask.task}
                    value={assignmentTask.answer}
                    isCorrect={assignmentTask.answer !== undefined
                        && (assignmentTask.answer === assignmentTask.solution
                            || assignmentTask.answer === taskSolution)}
                    answerOnly
                    solution={taskSolution}
                    isTeacher={isTeacher}
                />
            );
        }
        return null;
    };

    /**
     * Render task score
     *
     * @param {Object} assignmentTask Assignment task
     * @returns JSX
     */
    const renderScore = (assignmentTask) => {
        let score = 0;
        let possibleScore = (maxPoints / 100) * assignmentTask.fraction;
        possibleScore = Math.round(possibleScore * 100) / 100;
        if (assignmentTask.score !== undefined && assignmentTask.score > 0) {
            score = (maxPoints / 100) * assignmentTask.score;
            score = Math.round(score * 100) / 100;
        }
        if (score > 0) return <span className="absolute right-2 mt-1">{`${score} of ${possibleScore} points`}</span>;
        return <span className="absolute right-2 mt-1 text-red-600">{`${score} of ${possibleScore} points`}</span>;
    };

    return tasks.map((assignmentTask, index) => (
        <div key={assignmentTask.task.id}>
            <div className="flex relative">
                <h2>{`${language.dictionary.labelTask} #${index + 1}`}</h2>
                {maxPoints && renderScore(assignmentTask)}
            </div>
            {renderTask(assignmentTask)}
        </div>
    ));
};

export default Summary;
