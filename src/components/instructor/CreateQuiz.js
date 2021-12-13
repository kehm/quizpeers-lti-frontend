import React, { useContext, useEffect, useState } from 'react';
import LanguageContext from '../../context/LanguageContext';
import QuizSelection from './QuizSelection';
import QuizTypeSelection from '../components/inputs/QuizTypeSelect';
import { createQuizAssignment, getTaskAssignments, launchAssignment } from '../../utils/api/assignments';
import { getIncludedTasks } from '../../utils/api/tasks';
import SizeSelection from '../components/inputs/SizeSelection';
import DifficultySelection from '../components/inputs/DifficultySelection';
import CancelButton from '../components/buttons/CancelButton';
import QuizDeadline from '../components/QuizDeadline';
import QuizNextButton from '../components/buttons/QuizNextButton';

/**
 * Render view to create a quiz assignment
 */
const CreateQuiz = ({ onCancel }) => {
    const { language } = useContext(LanguageContext);
    const [error, setError] = useState(undefined);
    const [assignments, setAssignments] = useState(undefined);
    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState(undefined);
    const [step, setStep] = useState(0);
    const [errorDeadline, setErrorDeadline] = useState(false);
    const defaultFormValues = {
        title: '',
        selectionType: '',
        type: '',
        assignments: [],
        size: [0, 0, 0],
        groupSizes: {},
        weights: {},
        deadline: undefined,
        timer: [0, 0],
        timerChecked: false,
    };
    const [formValues, setFormValues] = useState(defaultFormValues);

    /**
     * Get all task assignments from API
     */
    useEffect(() => {
        if (!assignments) {
            const getAssignments = async () => {
                try {
                    const taskAssignments = await getTaskAssignments();
                    setAssignments(taskAssignments);
                } catch (err) {
                    setError(language.dictionary.internalAPIError);
                }
            };
            getAssignments();
        }
    }, [assignments]);

    /**
     * Get tasks from API
     */
    const getTasks = async () => {
        try {
            const tmpAssignments = assignments.filter((element) => element.selected);
            const assignmentIds = tmpAssignments.map((element) => element.id);
            setFormValues({ ...formValues, assignments: assignmentIds });
            const arr = await getIncludedTasks(assignmentIds);
            arr.forEach((element) => { element.difficulty = 2; });
            setTasks(arr);
            if (arr.length === 0) setError(language.dictionary.errorNoAvailable);
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Scroll to top on change step
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    /**
    * Check if deadline is valid
    */
    useEffect(() => {
        if (formValues.deadline && formValues.deadline !== null) {
            if (Date.parse(formValues.deadline) <= Date.parse(new Date())) {
                setErrorDeadline(true);
            } else setErrorDeadline(false);
        }
    }, [formValues.deadline]);

    /**
     * Submit quiz assignment to API
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const taskIds = [];
            const difficulties = [];
            selectedTasks.forEach((element) => {
                taskIds.push(element.id);
                difficulties.push(element.difficulty);
            });
            let size;
            let weight;
            if (formValues.selectionType === 'DIFFICULTY') {
                size = JSON.stringify(formValues.size);
            } else if (formValues.selectionType === 'GROUP') {
                size = JSON.stringify(formValues.groupSizes);
                if (Object.keys(formValues.weights).length > 0) {
                    weight = JSON.stringify(formValues.weights);
                }
            }
            const assignment = await createQuizAssignment({
                title: formValues.title,
                type: formValues.type,
                assignments: formValues.assignments,
                tasks: taskIds,
                difficulties,
                deadline: formValues.deadline,
                timer: formValues.timerChecked ? formValues.timer : undefined,
                size,
                weight,
            });
            await launchAssignment(assignment[0][0].assignment_id);
        } catch (err) {
            setError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Get selected tasks in existing order
     *
     * @param {Array} selected Selected tasks
     * @returns {Array} Selected tasks in existing order
     */
    const getSelectedTasks = (selected) => {
        let arr = [...selectedTasks];
        selected.forEach((task) => {
            if (!arr.find((element) => element.id === task.id)) arr.push(task);
        });
        if (arr.length !== selected.length) {
            arr = arr.filter((element) => {
                if (selected.find((task) => task.id === element.id)) return true;
                return false;
            });
        }
        return arr;
    };

    /**
     * Go to next step
     */
    const handleNext = () => {
        if (step === 0) getTasks();
        if (step === 1) {
            let selected = tasks.filter((element) => element.selected);
            if (selected.length > 0) {
                setError(undefined);
                if (selectedTasks) selected = getSelectedTasks(selected);
                setSelectedTasks(selected);
                setStep(step + 1);
            } else setError(language.dictionary.errorSelected);
        } else if (step === 2) {
            if (formValues.type === 'DEFINITE') {
                setStep(step + 2);
            } else setStep(step + 1);
        } else {
            setError(undefined);
            setStep(step + 1);
        }
    };

    /**
     * Go to previous step
     */
    const handlePrev = () => {
        setError(undefined);
        if (step === 3) {
            setFormValues({
                ...formValues,
                size: defaultFormValues.size,
                groupSizes: defaultFormValues.groupSizes,
            });
        }
        if (step === 4 && formValues.type === 'DEFINITE') {
            setStep(step - 2);
        } else setStep(step - 1);
    };

    /**
     * Select task
     *
     * @param {Object} task Task (boolean true/false to select/remove all)
     */
    const handleSelectTask = (task) => {
        const arr = [...tasks];
        if (task === true) {
            arr.forEach((element) => { element.selected = true; });
        } else if (task === false) {
            arr.forEach((element) => { element.selected = false; });
        } else {
            const sel = arr.find((element) => element.id === task.id);
            if (!sel.selected) {
                sel.selected = true;
            } else sel.selected = false;
        }
        setTasks(arr);
    };

    /**
     * Change task difficulty
     *
     * @param {int} val New difficulty level
     * @param {Object} task Task (reset all if undefined)
     */
    const handleChangeDifficulty = (val, task) => {
        const arr = [...selectedTasks];
        if (task) {
            const sel = arr.find((element) => element.id === task.id);
            sel.difficulty = val;
        } else arr.forEach((element) => { element.difficulty = 2; });
        setSelectedTasks(arr);
    };

    /**
     * Change task index
     *
     * @param {int} index Current index
     * @param {int} newIndex New index
     */
    const handleChangeTaskIndex = (index, newIndex) => {
        const arr = [...selectedTasks];
        const task = arr[index];
        arr.splice(index, 1);
        arr.splice(newIndex, 0, task);
        setSelectedTasks(arr);
    };

    /**
     * Select/unselect assignment
     *
     * @param {int} id Assignment ID (or boolean if select/unselect all)
     */
    const handleSelectAssignment = (id) => {
        const arr = [...assignments];
        if (Number.isInteger(id)) {
            const assignment = arr.find((element) => element.id === id);
            if (assignment) {
                if (assignment.selected) {
                    assignment.selected = false;
                } else assignment.selected = true;
            }
        } else if (id === true) {
            arr.forEach((element) => { element.selected = true; });
        } else arr.forEach((element) => { element.selected = false; });
        setAssignments(arr);
    };

    /**
     * Change group weight
     *
     * @param {int} groupId Group ID
     * @param {int} weight Weight percentage
     */
    const handleChangeWeight = (groupId, weight) => {
        if (!groupId) {
            setFormValues({ ...formValues, weights: weight });
        } else {
            const weights = { ...formValues.weights };
            weight = parseInt(weight, 10);
            if (weight > 0 && weight < 100) {
                let sum = 0;
                weights[groupId] = weight;
                Object.values(weights).forEach((element) => { sum += parseInt(element, 10); });
                if (sum <= 100) setFormValues({ ...formValues, weights });
            }
        }
    };

    /**
     * Render current step of creating quiz
     *
     * @returns JSX
     */
    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <QuizTypeSelection
                        formValues={formValues}
                        assignments={assignments}
                        onSelect={(id) => handleSelectAssignment(id)}
                        onChange={(e) => setFormValues({
                            ...formValues,
                            [e.target.name]: e.target.value,
                        })}
                    />
                );
            case 1:
                return (
                    <QuizSelection
                        type={formValues.type}
                        tasks={tasks}
                        onSelect={(task) => handleSelectTask(task)}
                    />
                );
            case 2:
                return (
                    <DifficultySelection
                        type={formValues.type}
                        tasks={selectedTasks}
                        onChangeDifficulty={(val, task) => handleChangeDifficulty(val, task)}
                        onChangeIndex={(index, newIndex) => handleChangeTaskIndex(index, newIndex)}
                    />
                );
            case 3:
                return (
                    <SizeSelection
                        formValues={formValues}
                        tasks={selectedTasks}
                        onChangeSize={(val) => setFormValues({ ...formValues, size: val })}
                        onChangeGroupSize={(id, val) => {
                            const groupSizes = { ...formValues.groupSizes };
                            groupSizes[id] = val;
                            setFormValues({ ...formValues, groupSizes });
                        }}
                        onChangeType={(type, sizes) => setFormValues({
                            ...formValues,
                            selectionType: type,
                            groupSizes: sizes,
                        })}
                        onChangeWeight={(groupId, weight) => handleChangeWeight(groupId, weight)}
                    />
                );
            case 4:
                return (
                    <QuizDeadline
                        values={formValues}
                        error={errorDeadline}
                        onChange={(name, val) => setFormValues({ ...formValues, [name]: val })}
                    />
                );
            default: return null;
        }
    };

    return (
        <form className="relative pb-20" onSubmit={handleSubmit}>
            <h1>{language.dictionary.headerCreateQuiz}</h1>
            {renderStep()}
            <div className="absolute bottom-0">
                <CancelButton
                    step={step}
                    onCancel={() => onCancel()}
                    onPrev={() => handlePrev()}
                />
            </div>
            {step !== 4 && (
                <QuizNextButton
                    values={formValues}
                    step={step}
                    assignments={assignments}
                    tasks={tasks}
                    onClick={() => handleNext()}
                />
            )}
            {error && <p className="text-red-600 pt-14">{error}</p>}
        </form>
    );
};

export default CreateQuiz;
