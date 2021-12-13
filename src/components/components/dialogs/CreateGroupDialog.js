import React, { useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LanguageContext from '../../../context/LanguageContext';
import CloseButton from '../buttons/CloseButton';
import InfoPopover from '../InfoPopover';
import CancelButton from '../buttons/CancelButton';

/**
 * Render create task group dialog
 */
const CreateGroupDialog = ({
    openDialog, error, onCreate, onClose,
}) => {
    const { language } = useContext(LanguageContext);
    const defaultFormValues = {
        name: '',
        description: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);

    /**
     * Reset form values
     */
    useEffect(() => {
        setFormValues(defaultFormValues);
    }, [openDialog]);

    /**
     * Render inputs for group name and description
     *
     * @returns JSX
     */
    const renderInputs = () => (
        <div className="px-4">
            <div className="relative">
                <span className="absolute -left-10 top-0">
                    <InfoPopover content={language.dictionary.infoGroupName} />
                </span>
                <TextField
                    autoComplete="off"
                    required
                    id="name"
                    name="name"
                    type="text"
                    label={language.dictionary.labelName}
                    variant="outlined"
                    fullWidth
                    value={formValues.name}
                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                    inputProps={{ maxLength: 30 }}
                />
            </div>
            <div className="relative mt-6">
                <span className="absolute -left-10 top-0">
                    <InfoPopover content={language.dictionary.infoGroupDescription} />
                </span>
                <TextField
                    autoComplete="off"
                    id="description"
                    name="description"
                    type="text"
                    label={language.dictionary.labelDescription}
                    multiline
                    rows={6}
                    variant="outlined"
                    fullWidth
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    inputProps={{ maxLength: 60 }}
                />
            </div>
        </div>
    );

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
                    onClick={() => onCreate(formValues)}
                >
                    {language.dictionary.btnSave}
                </Button>
            </div>
        </DialogActions>
    );

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose()}
        >
            <div className="p-2 mb-8">
                <DialogTitle>{language.dictionary.createTaskGroup}</DialogTitle>
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

export default CreateGroupDialog;
