import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseButton from '../buttons/CloseButton';
import TaskInfo from '../TaskInfo';

/**
 * Render task dialog
 */
const TaskDialog = ({ task, onClose }) => (
    <Dialog
        fullWidth
        scroll="paper"
        open={task !== undefined}
        onClose={() => onClose()}
    >
        <div className="p-2">
            <DialogContent>
                <CloseButton onClick={() => onClose()} />
                <TaskInfo task={task} />
            </DialogContent>
        </div>
    </Dialog>
);

export default TaskDialog;
