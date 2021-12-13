import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import LanguageContext from '../../../context/LanguageContext';
import formatDate from '../../../utils/format-date';

/**
 * Render submission list
 */
const SubmissionList = ({
    submissions, status, maxScore, selectable, onClickListItem, onSelect,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render item checkbox or status
     *
     * @param {Object} submission Submission
     * @returns JSX
     */
    const renderItemIcon = (submission) => {
        if (!selectable) return null;
        if (submission.status === 'PENDING') return language.dictionary.labelPending;
        return (
            <span className="ml-4 mr-3">
                <Checkbox
                    edge="start"
                    checked={submission.selected || false}
                    inputProps={{ 'aria-labelledby': submission.id }}
                    disabled={status === 'STARTED'}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => onSelect(!submission.selected, submission.id)}
                />
            </span>
        );
    };

    return (
        <div className="overflow-y-auto px-2 mt-4">
            <List>
                {submissions && submissions.map((submission, index) => (
                    <ListItem
                        key={submission.id}
                        className="rounded bg-gray-100 h-24 mb-2 shadow-md cursor-pointer hover:bg-blue-100"
                        onClick={() => onClickListItem(index)}
                    >
                        <ListItemIcon>
                            <span className="pr-4">
                                {renderItemIcon(submission)}
                            </span>
                        </ListItemIcon>
                        <ListItemText
                            primary={(
                                <span className="block w-full">
                                    {submission.quizpeers_user && submission.quizpeers_user.name
                                        ? submission.quizpeers_user.name : submission.id}
                                </span>
                            )}
                            secondary={submission.submitted_at
                                && formatDate(submission.submitted_at)}
                        />
                        {submission.status !== 'PENDING' && submission.lms_score !== null && (
                            <>
                                <span className="text-blue-600">{submission.lms_score}</span>
                                {`/${maxScore}`}
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default SubmissionList;
