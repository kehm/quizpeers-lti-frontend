import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import Publish from '@material-ui/icons/Publish';
import LanguageContext from '../../context/LanguageContext';
import SubmissionsActions from './buttons/SubmissionsActions';

/**
 * Render submission list header
 */
const SubmissionListHeader = ({
    tab, submissions, pending, published, status, type,
    onSelect, onPublish, onCreateGroup, onCreateTask, onToggleSolution,
}) => {
    const { language } = useContext(LanguageContext);

    if (tab === 0) {
        return (
            <SubmissionsActions
                submissions={submissions}
                status={status}
                pending={pending}
                published={published}
                onSelect={(val) => onSelect(val)}
                onPublish={(arr) => onPublish(arr)}
            />
        );
    }
    if (tab === 1) {
        if (published === 0) return <p className="mb-2">{language.dictionary.headerNoPublished}</p>;
        if (type === 'TASK_SUBMISSION') return null;
        return (
            <div className="pb-8">
                <span className="absolute right-12">
                    <Button
                        variant="contained"
                        color={status === 'PUBLISHED_WITH_SOLUTION' ? 'inherit' : 'secondary'}
                        size="medium"
                        endIcon={status === 'PUBLISHED_WITH_SOLUTION' ? <Remove /> : <Publish />}
                        onClick={() => onToggleSolution()}
                    >
                        {status === 'PUBLISHED_WITH_SOLUTION'
                            ? language.dictionary.btnHideSolution
                            : language.dictionary.btnPublishSolution}
                    </Button>
                </span>
            </div>
        );
    }
    return (
        <div className="pb-12">
            <span className="absolute right-12">
                <span className="mr-4">
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={<Add />}
                        onClick={() => onCreateGroup()}
                    >
                        {language.dictionary.btnNewGroup}
                    </Button>
                </span>
                <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    endIcon={<Add />}
                    onClick={() => onCreateTask()}
                >
                    {language.dictionary.btnNewTask}
                </Button>
            </span>
        </div>
    );
};

export default SubmissionListHeader;
