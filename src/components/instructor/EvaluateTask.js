import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import LanguageContext from '../../context/LanguageContext';
import { getSubmittedTasks } from '../../utils/api/tasks';
import TaskEval from './TaskEval';

/**
 * Render view to evaluate a task submission
 */
const EvaluateTask = ({
    submissions, index, groups, onEvaluated,
}) => {
    const { language } = useContext(LanguageContext);
    const history = useHistory();
    const location = useLocation();
    const [tasks, setTasks] = useState(undefined);
    const [selected, setSelected] = useState(0);
    const [error, setError] = useState(undefined);

    /**
     * Trigger get tasks for new submission
     */
    useEffect(() => {
        if (tasks) setTasks(undefined);
        setError(undefined);
    }, [index]);

    /**
     * Get submitted tasks from API
     */
    useEffect(() => {
        if (submissions && !tasks) {
            const getTasks = async () => {
                try {
                    const arr = await getSubmittedTasks(submissions[index].id);
                    setTasks(arr);
                    setError(undefined);
                } catch (err) {
                    setError(language.dictionary.internalAPIError);
                }
            };
            getTasks();
        }
    }, [submissions, tasks]);

    /**
     * Update task index from URL change
     */
    useEffect(() => {
        try {
            if (tasks) {
                const params = new URLSearchParams(location.search);
                const taskId = parseInt(params.get('task'), 10);
                const taskIndex = tasks.findIndex((element) => element.id === taskId);
                if (taskIndex > -1 && taskIndex < tasks.length) {
                    setSelected(taskIndex);
                } else setSelected(0);
            }
        } catch (err) {
            setSelected(0);
        }
    }, [location.search, tasks]);

    /**
     * Go to next submission
     *
     * @param {int} taskIndex Task index
     */
    const handleNext = (taskIndex) => {
        const params = new URLSearchParams(location.search);
        params.delete('task');
        if (taskIndex > -1 && tasks.length > taskIndex) {
            params.append('task', tasks[taskIndex].id);
        }
        history.push({ search: params.toString() });
    };

    /**
     * Render selected task
     *
     * @returns JSX
     */
    const renderTask = () => {
        if (tasks) {
            if (tasks.length > 0) {
                return (
                    <TaskEval
                        tasks={tasks}
                        submission={submissions[index]}
                        index={selected}
                        groups={groups}
                        error={error}
                        onNext={() => handleNext(selected + 1)}
                        onPrev={() => handleNext(selected - 1)}
                        onChangeTask={() => setTasks(undefined)}
                        onEvaluated={() => {
                            setError(undefined);
                            setTasks(undefined);
                            onEvaluated();
                        }}
                        onError={(message) => setError(message)}
                    />
                );
            }
            return <p className="text-red-600">{language.dictionary.noTasksSubmitted}</p>;
        }
        return null;
    };

    return (
        <div className="relative pb-20">
            {renderTask()}
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
};

export default EvaluateTask;
