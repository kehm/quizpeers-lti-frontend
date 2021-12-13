import React, { useContext } from 'react';
import LanguageContext from '../../../context/LanguageContext';
import BackButton from './BackButton';
import NextButton from './NextButton';

/**
 * Render task navigation buttons
 */
const TasksNav = ({
    index, tasks, onNext, onPrev,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="relative flex">
            <hr />
            <BackButton
                label={language.dictionary.btnPrevTask}
                onClick={() => onPrev()}
                disabled={index === 0}
            />
            <span className="absolute right-4">
                <NextButton
                    label={language.dictionary.btnNextTask}
                    onClick={() => onNext()}
                    disabled={index === tasks.length - 1}
                />
            </span>
        </div>
    );
};

export default TasksNav;
