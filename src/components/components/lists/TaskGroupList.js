import React, { useContext } from 'react';
import LanguageContext from '../../../context/LanguageContext';
import TaskList from './TaskList';

/**
 * Render task group list
 */
const TaskGroupList = ({ groups, includedTasks, onClickTask }) => {
    const { language } = useContext(LanguageContext);

    const notAssigned = includedTasks ? includedTasks.filter(
        (task) => !task.task_group_id,
    ) : [];
    return (
        <div className="mt-4">
            <h3 className="font-bold">{language.dictionary.headerNotAssigned}</h3>
            {notAssigned.length === 0 && language.dictionary.labelNoTasks}
            <TaskList
                tasks={notAssigned}
                showScore
                clickable
                onClickListItem={(task) => onClickTask(task)}
            />
            {groups && groups.map((group) => {
                const included = includedTasks ? includedTasks.filter(
                    (task) => task.task_group_id === group.id,
                ) : [];
                return (
                    <div
                        key={group.id}
                        className="mt-4"
                    >
                        <h3 className="font-bold">{`${group.name}:`}</h3>
                        {included.length === 0 && language.dictionary.labelNoTasks}
                        <TaskList
                            tasks={included}
                            showScore
                            clickable
                            onClickListItem={(task) => onClickTask(task)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default TaskGroupList;
