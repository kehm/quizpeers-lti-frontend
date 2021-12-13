import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../../context/LanguageContext';
import CloseButton from '../buttons/CloseButton';
import CreateMultipleChoice from '../inputs/CreateMultipleChoice';
import CreateCombineTerms from '../inputs/CreateCombineTerms';
import CreateNameImage from '../inputs/CreateNameImage';
import CancelButton from '../buttons/CancelButton';

/**
 * Render edit task dialog
 */
const EditTaskDialog = ({
    task, assignment, error, onSaveEdit, onClose,
}) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        taskId: '',
        type: '',
        title: '',
        description: '',
        mediaId: undefined,
        image: [],
        options: ['', ''],
        indexSolution: 0,
        solution: [],
        termPairs: [
            {
                term: { type: 'TEXT', term: '' },
                relatedTerm: { type: 'TEXT', term: '' },
            },
            {
                term: { type: 'TEXT', term: '' },
                relatedTerm: { type: 'TEXT', term: '' },
            },
        ],
    };
    const [formValues, setFormValues] = useState(defaultFormValues);

    /**
     * Set existing form values from task
     */
    useEffect(() => {
        let tmpTask = { ...task };
        if (task.edit) tmpTask = task.edit;
        const termPairs = [];
        if (task.type === 'COMBINE_TERMS') {
            tmpTask.solution.forEach((pair) => {
                const term = tmpTask.options[0].find((option) => option.id === pair[0]);
                const relatedTerm = tmpTask.options[1].find((option) => option.id === pair[1]);
                termPairs.push({
                    term: { type: term.type, term: term.term },
                    relatedTerm: { type: relatedTerm.type, term: relatedTerm.term },
                });
            });
        }
        let options = [];
        let indexSolution;
        if (task.type === 'MULTIPLE_CHOICE') {
            options = tmpTask.options.map((option) => option.option);
            indexSolution = tmpTask.options.findIndex((option) => option.id === tmpTask.solution);
        }
        setFormValues({
            ...formValues,
            exists: true,
            taskId: task.id,
            type: task.type,
            title: tmpTask.title,
            mediaId: tmpTask.media_id || tmpTask.mediaId,
            description: tmpTask.description,
            options,
            indexSolution,
            termPairs,
        });
    }, [task]);

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
     * Return task inputs
     *
     * @returns JSX
     */
    const renderInputs = () => {
        if (task.type === 'MULTIPLE_CHOICE') {
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
        if (task.type === 'COMBINE_TERMS') {
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
        if (task.type === 'NAME_IMAGE') {
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
     * Render action buttons
     *
     * @returns JSX
     */
    const renderActions = () => (
        <DialogActions>
            <div className="mb-6 px-4">
                <span className="absolute left-6">
                    <CancelButton
                        step={0}
                        onCancel={() => onClose()}
                    />
                </span>
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<SaveOutlined />}
                    onClick={() => onSaveEdit(formValues)}
                >
                    {language.dictionary.btnSaveTask}
                </Button>
            </div>
        </DialogActions>
    );

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={task !== undefined}
            onClose={() => onClose()}
        >
            <div className="p-2 mb-8">
                <DialogTitle>{language.dictionary.btnEditTask}</DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    {renderInputs()}
                    {error && <p className="text-red-600 mt-6">{error}</p>}
                </DialogContent>
            </div>
            {renderActions()}
        </Dialog>
    );
};

export default EditTaskDialog;
