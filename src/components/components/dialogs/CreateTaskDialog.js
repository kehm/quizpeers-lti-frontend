import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LanguageContext from '../../../context/LanguageContext';
import CloseButton from '../buttons/CloseButton';
import InfoPopover from '../InfoPopover';
import CreateTask from '../../learner/CreateTask';

/**
 * Render create task dialog
 */
const CreateTaskDialog = ({
    openDialog, assignment, error, onClose, onSuccess, onError,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <Dialog
            fullWidth
            scroll="paper"
            open={openDialog}
            onClose={() => onClose()}
        >
            <div className="p-2 mb-8">
                <DialogTitle>
                    {language.dictionary.headerCreateTask}
                    <span className="absolute top-4">
                        <InfoPopover content={language.dictionary.infoNewTask} />
                    </span>
                </DialogTitle>
                <DialogContent>
                    <CloseButton onClick={() => onClose()} />
                    {assignment && (
                        <CreateTask
                            assignment={assignment}
                            types={[
                                { value: 'MULTIPLE_CHOICE', label: language.dictionary.multipleChoice },
                                { value: 'COMBINE_TERMS', label: language.dictionary.termsTask },
                                { value: 'NAME_IMAGE', label: language.dictionary.nameImage },
                            ]}
                            tasks={[]}
                            selected={[]}
                            onSuccess={() => { onClose(); onSuccess(); }}
                            onExpired={() => { onError() }}
                        />
                    )}
                    {error && <p className="text-red-600">{error}</p>}
                </DialogContent>
            </div>
        </Dialog>
    );
};

export default CreateTaskDialog;
