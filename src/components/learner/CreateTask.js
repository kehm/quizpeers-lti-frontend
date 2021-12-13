import React, { useContext, useEffect, useState } from 'react';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import Replay from '@material-ui/icons/Replay';
import LanguageContext from '../../context/LanguageContext';
import CreateMultipleChoice from '../components/inputs/CreateMultipleChoice';
import CreateCombineTerms from '../components/inputs/CreateCombineTerms';
import { createCombineTermsTask, createMultipleChoiceTask, createNameImageTask } from '../../utils/api/tasks';
import TaskInfo from '../components/TaskInfo';
import CreateNameImage from '../components/inputs/CreateNameImage';
import TypeSelect from '../components/inputs/TypeSelect';
import CancelButton from '../components/buttons/CancelButton';

/**
 * Render task submission form
 */
const CreateTask = ({
    assignment, types, tasks, selected, onSuccess, onExpired,
}) => {
    const { language } = useContext(LanguageContext);
    const [type, setType] = useState('');
    const [error, setError] = useState(undefined);
    const [replaceId, setReplaceId] = useState(undefined);
    const defaultFormValues = {
        assignmentId: assignment.id || assignment.assignment_id,
        title: '',
        description: '',
        image: [],
        options: ['', ''],
        indexSolution: 0,
        termPairs: [
            {
                term: { type: 'TEXT', term: undefined },
                relatedTerm: { type: 'TEXT', term: undefined },
            },
            {
                term: { type: 'TEXT', term: undefined },
                relatedTerm: { type: 'TEXT', term: undefined },
            },
        ],
        nameSolution: undefined,
    };
    const [formValues, setFormValues] = useState(defaultFormValues);

    /**
     * Cancel replace task on nav click
     */
    useEffect(() => {
        setReplaceId(undefined);
        setError(undefined);
    }, [selected]);

    /**
     * Reset form on change type
     */
    useEffect(() => {
        setFormValues(defaultFormValues);
    }, [type, replaceId]);

    /**
     * Submit task to API
     *
     * @param {Object} data Form data
     */
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            let valid = true;
            let err = language.dictionary.missingImageError;
            if (type === 'MULTIPLE_CHOICE') {
                const arr = [...new Set(formValues.options)];
                if (arr.length === formValues.options.length) {
                    await createMultipleChoiceTask(formValues, replaceId, true);
                } else {
                    valid = false;
                    err = language.dictionary.optionsError;
                }
            } else if (type === 'COMBINE_TERMS') {
                for (let i = 0; i < formValues.termPairs.length; i += 1) {
                    if (!formValues.termPairs[i].term.term
                        || !formValues.termPairs[i].relatedTerm.term) {
                        valid = false;
                        break;
                    }
                }
                if (valid) await createCombineTermsTask(formValues, replaceId, true);
            } else if (type === 'NAME_IMAGE') {
                if (formValues.image && formValues.image.length > 0) {
                    await createNameImageTask(formValues, replaceId, true);
                } else valid = false;
            }
            if (valid) {
                setType('');
                setFormValues(defaultFormValues);
                setReplaceId(undefined);
                setError(undefined);
                onSuccess(true);
            } else setError(err);
        } catch (err) {
            if (err.response && err.response.status === 405) {
                onExpired();
            } else {
                setFormValues({ ...formValues, termPairs: defaultFormValues.termPairs });
                setError(language.dictionary.internalAPIError);
            }
        }
    };

    /**
     * Render existing task
     *
     * @returns JSX
     */
    const renderExistingTask = (task) => (
        <>
            <TaskInfo task={task} />
            <Button
                variant="contained"
                color="default"
                size="medium"
                endIcon={<Replay />}
                onClick={() => {
                    setType('');
                    setReplaceId(task.id);
                }}
            >
                {language.dictionary.btnReplaceTask}
            </Button>
        </>
    );

    /**
     * Add, change or remove an option
     *
     * @param {Object} value Option (true/false for add/remove)
     * @param {int} index Option index
     */
    const handleChangeOption = (value, index) => {
        const arr = [...formValues.options];
        if (value === true) {
            arr.push('');
        } else if (value === false) {
            arr.splice(index, 1);
        } else arr[index] = value;
        setFormValues({
            ...formValues,
            options: arr,
        });
    };

    /**
     * Render task inputs
     *
     * @returns JSX
     */
    const renderInputs = () => {
        if (type === 'MULTIPLE_CHOICE') {
            return (
                <CreateMultipleChoice
                    formValues={formValues}
                    onChangeOption={(index, value) => handleChangeOption(value, index)}
                    onAddOption={() => handleChangeOption(true)}
                    onRemoveOption={(index) => handleChangeOption(false, index)}
                    onChange={(e) => setFormValues({
                        ...formValues,
                        [e.target.name]: e.target.value,
                    })}
                />
            );
        }
        if (type === 'COMBINE_TERMS') {
            return (
                <CreateCombineTerms
                    formValues={formValues}
                    onChange={(e) => setFormValues({
                        ...formValues,
                        [e.target.name]: e.target.value,
                    })}
                />
            );
        }
        if (type === 'NAME_IMAGE') {
            return (
                <CreateNameImage
                    glossary={assignment.glossary}
                    formValues={formValues}
                    onChange={(e) => setFormValues({
                        ...formValues,
                        [e.target.name]: e.target.value,
                    })}
                />
            );
        }
        return null;
    };

    /**
     * Render new or existing task
     *
     * @returns JSX
     */
    const renderTask = () => {
        if (!replaceId && tasks.length > selected) return renderExistingTask(tasks[selected]);
        return (
            <>
                <TypeSelect
                    type={type}
                    types={types}
                    label={language.dictionary.labelTaskType}
                    required
                    onChange={(e) => setType(e.target.value)}
                />
                {renderInputs()}
                {replaceId && (
                    <span className="absolute bottom-0 left-0">
                        <CancelButton
                            step={0}
                            onCancel={() => setReplaceId(undefined)}
                        />
                    </span>
                )}
                <span className="absolute bottom-0 right-0">
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<SaveOutlined />}
                        disabled={type === ''
                            || (type === 'MULTIPLE_CHOICE' && formValues.options.length < 2)}
                    >
                        {language.dictionary.btnSaveTask}
                    </Button>
                </span>
            </>
        );
    };

    return (
        <form className="relative pb-20" onSubmit={handleSubmit}>
            {renderTask()}
            {error && <p className="text-red-600 mt-8">{error}</p>}
        </form>
    );
};

export default CreateTask;
