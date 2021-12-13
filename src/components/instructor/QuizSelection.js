import React, { useContext } from 'react';
import LanguageContext from '../../context/LanguageContext';
import TaskList from '../components/lists/TaskList';
import InfoPopover from '../components/InfoPopover';
import SelectButtons from '../components/buttons/SelectButtons';

/**
 * Render view for selecting tasks for quiz assignment
 */
const QuizSelection = ({ type, tasks, onSelect }) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render available tasks for quiz
     */
    const renderAvailable = () => (
        <div className="py-6">
            <div className="absolute right-0">
                <SelectButtons
                    showSelect={tasks
                        && tasks.filter((element) => element.selected).length !== tasks.length}
                    selectDisabled={tasks.length === 0}
                    resetLabel={language.dictionary.btnRemoveAll}
                    onSelect={(val) => onSelect(val)}
                />
            </div>
            <h3 className="font-bold mb-6">{language.dictionary.labelTasks}</h3>
            <TaskList
                tasks={tasks}
                selectable
                onClickListItem={(task) => onSelect(task)}
            />
        </div>
    );

    return (
        <>
            <div className="flex">
                <h2 className="mt-4 mb-8">{language.dictionary.headerStep2}</h2>
                <span className="mt-2">
                    <InfoPopover content={language.dictionary.tasksDesc} />
                </span>
            </div>
            <hr className="mb-6" />
            <dl className="grid">
                <dt className="col-start-1 font-bold">
                    {language.dictionary.labelType}
                </dt>
                <dd className="col-start-2">
                    {type === 'DEFINITE' ? language.dictionary.typeDefinite : language.dictionary.typeRandomized}
                </dd>
            </dl>
            {type && tasks && renderAvailable()}
            <p className="mb-2">
                {`${tasks.filter((task) => task.selected).length} ${language.dictionary.labelTasksSelected}`}
            </p>
        </>
    );
};

export default QuizSelection;
