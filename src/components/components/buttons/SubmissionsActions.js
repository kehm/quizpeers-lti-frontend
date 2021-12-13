import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Publish from '@material-ui/icons/Publish';
import LanguageContext from '../../../context/LanguageContext';
import SelectButtons from './SelectButtons';

/**
 * Render submissions action buttons
 */
const SubmissionsActions = ({
    submissions, status, pending, published, onSelect, onPublish,
}) => {
    const { language } = useContext(LanguageContext);
    const selectedSubmissions = pending.filter((element) => element.selected);
    const evaluatedSubmissions = pending.filter((element) => element.status !== 'PENDING');

    return (
        <>
            <div className="flex">
                <SelectButtons
                    showSelect={evaluatedSubmissions.length === 0
                        || selectedSubmissions.length !== evaluatedSubmissions.length}
                    selectDisabled={evaluatedSubmissions.length === 0 || status === 'STARTED'}
                    onSelect={(val) => onSelect(val)}
                />
                <span className="absolute right-12">
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={<Publish />}
                        onClick={() => {
                            const arr = [];
                            submissions.forEach((element) => {
                                if (element.selected) arr.push(element.id);
                            });
                            onPublish(arr);
                        }}
                        disabled={selectedSubmissions.length === 0 || status === 'STARTED'}
                    >
                        {language.dictionary.btnPublishSelected}
                    </Button>
                </span>
            </div>
            {(!pending || pending.length === 0) && published.length === 0
                && <p className="mt-4">{language.dictionary.headerNoSubmitted}</p>}
        </>
    );
};

export default SubmissionsActions;
