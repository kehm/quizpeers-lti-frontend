import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LanguageContext from '../../context/LanguageContext';

/**
 * Render submissions top bar
 */
const SubmissionsBar = ({ tab, assignment }) => {
    const { language } = useContext(LanguageContext);
    const history = useHistory();
    const location = useLocation();

    return (
        <AppBar
            position="relative"
            className="mt-6 mb-4"
            color="default"
        >
            <Tabs
                value={tab}
                onChange={(e, val) => {
                    const params = new URLSearchParams(location.search);
                    params.set('tab', val);
                    history.push({ search: params.toString() });
                }}
                aria-label="submission tabs"
            >
                <Tab label={language.dictionary.labelPending} />
                <Tab
                    label={language.dictionary.labelPublished}
                    disabled={assignment.status === 'CREATED' || assignment.status === 'STARTED'}
                />
                {assignment.type === 'TASK_SUBMISSION' && (
                    <Tab
                        label={language.dictionary.labelIncludedTasks}
                        disabled={assignment.status === 'CREATED' || assignment.status === 'STARTED'}
                    />
                )}
            </Tabs>
        </AppBar>
    );
};

export default SubmissionsBar;
