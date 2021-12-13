import React, { useContext, useState } from 'react';
import LanguageContext from '../../context/LanguageContext';
import CreateTaskAssignment from './CreateTaskAssignment';
import CreateQuiz from './CreateQuiz';
import TypeSelect from '../components/inputs/TypeSelect';

/**
 * Render view to create a new assignment
 */
const CreateAssignment = () => {
    const { language } = useContext(LanguageContext);
    const [type, setType] = useState('');
    const types = [
        { value: 'TASK', label: language.dictionary.taskSubmission },
        { value: 'QUIZ', label: language.dictionary.quizSubmission },
    ];

    /**
     * Render assignment
     *
     * @returns JSX
     */
    const renderAssignment = () => {
        if (type === 'QUIZ') return <CreateQuiz onCancel={() => setType('')} />;
        if (type === 'TASK') return <CreateTaskAssignment onCancel={() => setType('')} />;
        return null;
    };

    return (
        <div className="p-4 rounded max-w-xl m-auto">
            {type === '' ? (
                <TypeSelect
                    type={type}
                    types={types}
                    label={language.dictionary.labelAssignmentType}
                    required
                    onChange={(e) => setType(e.target.value)}
                />
            ) : renderAssignment()}
        </div>
    );
};

export default CreateAssignment;
