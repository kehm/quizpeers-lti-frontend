import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import LanguageContext from '../../../context/LanguageContext';
import InfoPopover from '../InfoPopover';

/**
 * Render inputs for task title and description
 */
const TaskDescription = ({ formValues, descriptionRequired, onChange }) => {
    const { language } = useContext(LanguageContext);

    return (
        <>
            <div className="relative">
                <span className="absolute -left-10 top-0">
                    <InfoPopover content={language.dictionary.infoShortDesc} />
                </span>
                <TextField
                    autoComplete="off"
                    required
                    id="title"
                    name="title"
                    type="text"
                    label={language.dictionary.labelTitle}
                    variant="outlined"
                    fullWidth
                    value={formValues.title}
                    onChange={onChange}
                    inputProps={{ maxLength: 60 }}
                />
            </div>
            <div className="relative mt-6">
                <span className="absolute -left-10 top-0">
                    <InfoPopover content={language.dictionary.infoTaskText} />
                </span>
                <TextField
                    autoComplete="off"
                    required={descriptionRequired || false}
                    id="description"
                    name="description"
                    type="text"
                    label={language.dictionary.labelTaskDescription}
                    multiline
                    rows={6}
                    variant="outlined"
                    fullWidth
                    value={formValues.description}
                    onChange={onChange}
                    inputProps={{ maxLength: 560 }}
                />
            </div>
        </>
    );
};

export default TaskDescription;
