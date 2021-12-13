import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';
import ImageNameSelect from './inputs/ImageNameSelect';
import ThumbnailImage from './ThumbnailImage';

/**
 * Render name image task for quiz
 */
const NameImageTask = ({
    task, value, glossary, isCorrect, answerOnly, isTeacher, solution, onChangeAnswer,
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
                        <p className={`ml-8 mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{value}</p>
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
                    <p className="ml-8 mt-2">{value}</p>
                </>
            );
        }
        return <h3 className="font-bold text-red-600">{language.dictionary.noAnswer}</h3>;
    };

    return (
        <div className="p-4 border-2 border-solid rounded my-4">
            <h2>{task.edit ? task.edit.title : task.title}</h2>
            <div className="mt-4 mb-6">
                <p className="break-words mb-4">
                    {task.edit ? task.edit.description : task.description}
                </p>
                {task.options && task.options.length > 0 && (
                    <ThumbnailImage
                        mediaId={task.options[0]}
                        alt="Task illustration"
                    />
                )}
            </div>
            {answerOnly ? renderAnswer() : (
                <ImageNameSelect
                    value={value}
                    glossary={glossary}
                    onChange={(e) => onChangeAnswer(e.target.value)}
                />
            )}
            {solution && !isCorrect && (
                <>
                    <h3 className="font-bold mt-4">{language.dictionary.labelCorrect}</h3>
                    <p className="ml-8 mt-2">{solution}</p>
                </>
            )}
        </div>
    );
};

export default NameImageTask;
