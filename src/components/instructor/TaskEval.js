import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import EditOutlined from '@material-ui/icons/EditOutlined';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import LanguageContext from '../../context/LanguageContext';
import TaskInfo from '../components/TaskInfo';
import {
    createCombineTermsTask, createMultipleChoiceTask,
    createNameImageTask,
    deleteTaskEdit, evaluateTask,
} from '../../utils/api/tasks';
import TaskEvaluation from '../components/inputs/TaskEvaluation';
import EditTaskDialog from '../components/dialogs/EditTaskDialog';
import ConfirmDialog from '../components/dialogs/ConfirmDialog';
import TaskStatus from '../components/TaskStatus';
import TasksNav from '../components/buttons/TaskNav';

/**
 * Render task evaluation view
 */
const TaskEval = ({
    tasks, error, submission, index, groups, onNext, onPrev, onChangeTask, onEvaluated, onError,
}) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        score: 0,
        include: false,
        groupId: undefined,
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [openEdit, setOpenEdit] = useState(undefined);
    const [editScore, setEditScore] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(undefined);
    const [type, setType] = useState('ORIGINAL');

    /**
     * Reset form values on next/prev task
     */
    useEffect(() => {
        setEditScore(false);
        setType(tasks[index].edit ? 'EDIT' : 'ORIGINAL');
        if (tasks[index].status !== 'PENDING') {
            setFormValues({
                score: tasks[index].score,
                include: tasks[index].status === 'EVALUATED_INCLUDE',
                groupId: tasks[index].task_group_id,
            });
        } else setFormValues(defaultFormValues);
    }, [index]);

    /**
     * Reset group ID when selecting to not include task
     */
    const handleEvalChange = (e) => {
        if (e.target.name === 'include') {
            let { groupId } = formValues;
            if (!e.target.value) groupId = undefined;
            setFormValues({ ...formValues, groupId, include: e.target.value });
        } else {
            setFormValues({
                ...formValues,
                [e.target.name]: e.target.value,
            });
        }
    };

    /**
     * Submit evaluation to API
     *
     * @param {Object} e Event
     */
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            await evaluateTask(
                tasks[index].id,
                submission.id,
                formValues.score,
                formValues.include,
                formValues.groupId,
            );
            onEvaluated();
        } catch (err) {
            onError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Delete task edit
     */
    const handleDeleteEdit = async () => {
        try {
            await deleteTaskEdit(tasks[index].id);
            onEvaluated();
        } catch (err) {
            onError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Submit task changes to API
     *
     * @param {Object} values Task values
     */
    const handleSaveEdit = async (values) => {
        try {
            values.assignmentId = submission.assignment_id;
            if (values.type === 'MULTIPLE_CHOICE') {
                await createMultipleChoiceTask(values, values.taskId, false);
            } else if (values.type === 'COMBINE_TERMS') {
                await createCombineTermsTask(values, values.taskId, false);
            } else if (values.type === 'NAME_IMAGE') {
                await createNameImageTask(values, values.taskId, false);
            }
            setOpenEdit(undefined);
            onChangeTask();
        } catch (err) {
            onError(language.dictionary.internalAPIError);
        }
    };

    /**
     * Render task
     *
     * @param {Object} task Task
     * @returns JSX
     */
    const renderTask = (task) => (
        <>
            <TaskInfo
                task={task}
                showVersionSelect
                onChangeType={(val) => setType(val)}
            />
            {submission.assignment.status !== 'CREATED' && submission.assignment.status !== 'STARTED' && (
                <Button
                    variant="contained"
                    color="default"
                    size="medium"
                    endIcon={<EditOutlined />}
                    onClick={() => setOpenEdit(task)}
                >
                    {language.dictionary.btnEditTask}
                </Button>
            )}
            {type === 'EDIT' && (
                <span className="absolute right-0 text-red-600">
                    <Button
                        variant="contained"
                        color="inherit"
                        size="medium"
                        endIcon={<DeleteOutline />}
                        onClick={() => setOpenConfirm(language.dictionary.textConfirmDeleteEdit)}
                    >
                        {language.dictionary.btnDeleteEdit}
                    </Button>
                </span>
            )}
        </>
    );

    return (
        <form className="relative pb-6" onSubmit={handleSubmit}>
            <div className="relative my-8 bg-gray-100 rounded p-4 pb-8">
                <h3 className="mb-6 font-light">
                    {`${language.dictionary.labelTask} ${index + 1} ${language.dictionary.of} ${tasks.length}`}
                </h3>
                <TasksNav
                    index={index}
                    tasks={tasks}
                    onNext={() => onNext()}
                    onPrev={() => onPrev()}
                />
                {submission.assignment.status !== 'CREATED' && submission.assignment.status !== 'STARTED' && (
                    <div className="mt-6">
                        {tasks[index].status === 'PENDING' || editScore ? (
                            <TaskEvaluation
                                formValues={formValues}
                                submissionStatus={submission.status}
                                groups={groups}
                                onChange={(e) => handleEvalChange(e)}
                            />
                        ) : (
                            <TaskStatus
                                task={tasks[index]}
                                status={submission.status}
                                onEdit={() => setEditScore(true)}
                            />
                        )}
                    </div>
                )}
            </div>
            {renderTask(tasks[index])}
            {openEdit && (
                <EditTaskDialog
                    task={openEdit}
                    assignment={submission.assignment}
                    error={error}
                    onSaveEdit={(values) => handleSaveEdit(values)}
                    onClose={() => setOpenEdit(undefined)}
                />
            )}
            <ConfirmDialog
                openContent={openConfirm}
                onClose={() => setOpenConfirm(undefined)}
                onConfirm={() => handleDeleteEdit()}
            />
        </form>
    );
};

export default TaskEval;
