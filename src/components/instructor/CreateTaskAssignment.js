import React, { useContext, useEffect, useState } from 'react';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../context/LanguageContext';
import InfoPopover from '../components/InfoPopover';
import { createTaskAssignment, launchAssignment } from '../../utils/api/assignments';
import TaskAssignmentForm from '../components/inputs/TaskAssignmentForm';
import CancelButton from '../components/buttons/CancelButton';

/**
 * Render view to create a new task assignment
 */
const CreateTaskAssignment = ({ onCancel }) => {
    const { language } = useContext(LanguageContext);
    const [error, setError] = useState(undefined);
    const [errorDeadline, setErrorDeadline] = useState(false);
    const defaultFormValues = {
        title: '',
        accepts: [],
        size: 1,
        deadline: undefined,
        glossary: [],
    };
    const [formValues, setFormValues] = useState(defaultFormValues);

    /**
    * Check if the selected deadline is valid
    */
    useEffect(() => {
        if (formValues.deadline) {
            if (Date.parse(formValues.deadline) <= Date.parse(new Date())) {
                setErrorDeadline(true);
            } else setErrorDeadline(false);
        }
    }, [formValues.deadline]);

    /**
     * Submit assignment to API
     *
     * @param {*} e Submit form event
     */
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!errorDeadline) {
            try {
                if (formValues.accepts.find((element) => element.value === 'NAME_IMAGE') && formValues.glossary.length === 0) {
                    setError(language.dictionary.glossaryRequired);
                } else {
                    const assignment = await createTaskAssignment(
                        {
                            title: formValues.title,
                            types: formValues.accepts.map((element) => element.value),
                            size: parseInt(formValues.size, 10),
                            deadline: formValues.deadline,
                        },
                        formValues.glossary,
                    );
                    await launchAssignment(assignment[0][0].assignment_id);
                }
            } catch (err) {
                setError(language.dictionary.creationError);
            }
        }
    };

    /**
     * Render action buttons
     *
     * @returns JSX
     */
    const renderActions = () => (
        <>
            <div className="absolute bottom-0">
                <CancelButton
                    step={0}
                    onCancel={() => onCancel()}
                />
            </div>
            <span className="absolute bottom-0 right-0">
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<SaveOutlined />}
                    disabled={formValues.title === '' || formValues.accepts.length === 0 || !formValues.deadline || errorDeadline}
                >
                    {language.dictionary.btnSave}
                </Button>
            </span>
        </>
    );

    return (
        <form className="relative pb-20" onSubmit={(e) => onSubmit(e)}>
            <h1 className="mb-8">{language.dictionary.headerCreateAssignment}</h1>
            <div className="flex">
                <h2 className="mt-4 mb-8">{language.dictionary.taskSubmission}</h2>
                <span className="mt-2">
                    <InfoPopover content={language.dictionary.taskSubDesc} />
                </span>
            </div>
            <hr className="mb-6" />
            <TaskAssignmentForm
                values={formValues}
                onChange={(name, val) => setFormValues({ ...formValues, [name]: val })}
            />
            {errorDeadline && <p className="text-red-600 mb-8 pt-4">{language.dictionary.errorDeadline}</p>}
            {renderActions()}
            {error && <p className="text-red-600 pt-6">{error}</p>}
        </form>
    );
};

export default CreateTaskAssignment;
