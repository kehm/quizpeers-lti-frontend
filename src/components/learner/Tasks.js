import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import LanguageContext from '../../context/LanguageContext';
import CreateTask from './CreateTask';
import { getSubmission } from '../../utils/api/submissions';
import { getSubmittedTasks } from '../../utils/api/tasks';
import BackButton from '../components/buttons/BackButton';
import NextButton from '../components/buttons/NextButton';
import formatDate from '../../utils/format-date';

/**
 * Render task assignment for student
 */
const Tasks = ({ assignment, onExpired }) => {
    const { language } = useContext(LanguageContext);
    const history = useHistory();
    const location = useLocation();
    const [types, setTypes] = useState(undefined);
    const [statusHeader, setStatusHeader] = useState(undefined);
    const [submission, setSubmission] = useState(undefined);
    const [complete, setComplete] = useState(false);
    const [selected, setSelected] = useState(0);
    const [tasks, setTasks] = useState(undefined);
    const [error, setError] = useState(undefined);

    /**
     * Check which task types are accepted
     */
    useEffect(() => {
        if (!types && assignment.taskTypes) {
            const arr = [];
            assignment.taskTypes.forEach((element) => {
                if (element === 'MULTIPLE_CHOICE') {
                    arr.push({ value: 'MULTIPLE_CHOICE', label: language.dictionary.multipleChoice });
                } else if (element === 'COMBINE_TERMS') {
                    arr.push({ value: 'COMBINE_TERMS', label: language.dictionary.termsTask });
                } else if (element === 'NAME_IMAGE') {
                    arr.push({ value: 'NAME_IMAGE', label: language.dictionary.nameImage });
                }
            });
            setTypes(arr);
        }
    }, [assignment, language, types]);

    /**
     * Update task index from URL change
     */
    useEffect(() => {
        try {
            if (tasks) {
                const params = new URLSearchParams(location.search);
                const taskId = parseInt(params.get('task'), 10);
                const taskIndex = tasks.findIndex((element) => element.id === taskId);
                let sel = 0;
                if (taskIndex === -1 && tasks.length < assignment.size) {
                    sel = tasks.length;
                } else if (taskIndex > -1 && taskIndex < tasks.length) {
                    sel = taskIndex;
                }
                setSelected(sel);
                setStatusHeader(`${sel + 1} ${language.dictionary.of} ${assignment.size}`);
            }
        } catch (err) {
            setSelected(0);
            setStatusHeader(`1 ${language.dictionary.of} ${assignment.size}`);
        }
    }, [location.search, tasks]);

    /**
     * Set submission and tasks array
     */
    const initSub = async () => {
        try {
            const tmpSub = await getSubmission(assignment.id || assignment.assignment_id);
            setSubmission(tmpSub);
            const tmpTasks = await getSubmittedTasks(tmpSub.id);
            setTasks(tmpTasks);
            if (tmpSub.status !== 'STARTED') setComplete(true);
            setError(undefined);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setTasks([]);
            } else if (err.response && err.response.status === 405) {
                onExpired();
            } else setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Initialize submission object
     */
    useEffect(() => {
        if (!submission) initSub();
    }, [submission, assignment, language, onExpired]);

    /**
     * Go to next task
     *
     * @param {int} index Task index
     */
    const handleNext = (index) => {
        const params = new URLSearchParams();
        if (index > -1 && tasks.length > index) params.append('task', tasks[index].id);
        history.push({ search: params.toString() });
    };

    /**
     * Render navigation buttons
     *
     * @returns JSX
     */
    const renderNavigation = () => (
        <div className="relative flex mt-2">
            <BackButton
                label={language.dictionary.btnPrevTask}
                onClick={() => handleNext(selected - 1)}
                disabled={selected === 0}
            />
            <span className="absolute right-4">
                <NextButton
                    label={language.dictionary.btnNextTask}
                    onClick={() => handleNext(selected + 1)}
                    disabled={selected === assignment.size - 1 || selected === tasks.length}
                />
            </span>
        </div>
    );

    return (
        <>
            <div className="mt-6 border-b-2 border-solid mb-4 pb-5">
                <h1>
                    {language.dictionary.labelSubmitTask}
                    {statusHeader && ` (${statusHeader})`}
                </h1>
                {complete
                    ? <h2 className="text-base text-blue-600 py-4">{language.dictionary.submissionDelivered}</h2>
                    : (
                        <h2 className="text-base text-blue-600 py-4">
                            {language.dictionary.labelSubDeadline}
                            <span className="font-bold">{formatDate(assignment.deadline)}</span>
                        </h2>
                    )}
                {tasks && renderNavigation()}
            </div>
            {types && tasks && (
                <CreateTask
                    assignment={assignment}
                    types={types}
                    tasks={tasks}
                    selected={selected}
                    onSuccess={() => {
                        if (submission) {
                            setSubmission(undefined);
                        } else initSub();
                    }}
                    onExpired={() => onExpired()}
                />
            )}
            {error && <p className="text-red-600 pt-14">{error}</p>}
        </>
    );
};

export default Tasks;
