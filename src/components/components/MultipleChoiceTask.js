import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';
import OptionList from './lists/OptionList';
import ThumbnailImage from './ThumbnailImage';

/**
 * Render multiple choice task for quiz
 */
const MultipleChoiceTask = ({
    task, value, isCorrect, answerOnly, isTeacher, solution, onChangeAnswer,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render selected answer info
     *
     * @returns JSX
     */
    const renderAnswer = () => {
        if (value !== undefined) {
            if (isTeacher || solution) {
                return (
                    <>
                        <h3 className="font-bold text-blue-600">
                            {isTeacher
                                ? language.dictionary.labelStudentAnswer
                                : language.dictionary.labelAnswer}
                        </h3>
                        <p className={`ml-8 mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {task.options.find((element) => element.id === value).option}
                        </p>
                    </>
                );
            }
            return (
                <>
                    <h3 className="font-bold text-blue-600">
                        {isTeacher
                            ? language.dictionary.labelStudentAnswer
                            : language.dictionary.labelAnswer}
                    </h3>
                    <p className="ml-8 mt-2">
                        {task.options.find((element) => element.id === value).option}
                    </p>
                </>
            );
        }
        return <h3 className="font-bold text-red-600">{language.dictionary.noAnswer}</h3>;
    };

    /**
     * Render correct answer
     *
     * @returns JSX
     */
    const renderSolution = () => {
        const option = task.options.find(
            (element) => element.id === solution,
        );
        return (
            <>
                <h3 className="font-bold mt-4">{language.dictionary.labelCorrect}</h3>
                <p className="ml-8 mt-2">
                    {option && option.option}
                </p>
            </>
        );
    };

    return (
        <>
            <div className="p-4 border-2 border-solid rounded my-4">
                <h2>{task.edit ? task.edit.title : task.title}</h2>
                <div className="mt-4 mb-6">
                    <p className="break-words mb-4">
                        {task.edit ? task.edit.description : task.description}
                    </p>
                    {task.media_id && (
                        <ThumbnailImage
                            mediaId={task.media_id}
                            alt="Task illustration"
                        />
                    )}
                </div>
                {answerOnly
                    ? renderAnswer()
                    : (
                        <>
                            <h3 className="font-light">{language.dictionary.headerOptions}</h3>
                            <OptionList
                                options={task.options || []}
                                selected={value}
                                selectable
                                onSelectOption={(id) => onChangeAnswer(id)}
                            />
                        </>
                    )}
                {solution && !isCorrect && renderSolution()}
            </div>
            {!answerOnly && renderAnswer()}
        </>
    );
};

export default MultipleChoiceTask;
