import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import LanguageContext from '../../../context/LanguageContext';
import InfoPopover from '../InfoPopover';
import DeadlineSelect from './DeadlineSelect';
import FileDrop from './FileDrop';

/**
 * Render form for creating a task assignment
 */
const TaskAssignmentForm = ({ values, onChange }) => {
    const { language } = useContext(LanguageContext);
    const maxTasks = 50;
    const types = [
        { value: 'MULTIPLE_CHOICE', label: language.dictionary.multipleChoice },
        { value: 'COMBINE_TERMS', label: language.dictionary.termsTask },
        { value: 'NAME_IMAGE', label: language.dictionary.nameImage },
    ];

    /**
     * Set number of tasks required for submission
     *
     * @param {int} taskSize Tasks required
     */
    const handleSetTaskSize = (taskSize) => {
        if (taskSize > 0 && taskSize <= maxTasks) onChange('size', taskSize);
    };

    /**
     * Render input for number of tasks
     *
     * @returns JSX
     */
    const renderSizeInput = () => (
        <div className="mt-4 pb-20">
            <div className="absolute -left-10"><InfoPopover content={language.dictionary.infoSize} /></div>
            <div className="w-32 float-left">
                <TextField
                    autoComplete="off"
                    fullWidth
                    id="size"
                    name="size"
                    type="number"
                    label={language.dictionary.labelSize}
                    variant="outlined"
                    value={values.size}
                    onChange={(e) => handleSetTaskSize(e.target.value)}
                    inputProps={{ min: 1, max: maxTasks }}
                />
            </div>
        </div>
    );

    return (
        <>
            <TextField
                autoComplete="off"
                required
                id="title"
                name="title"
                type="text"
                label={language.dictionary.labelTitle}
                variant="outlined"
                fullWidth
                value={values.title}
                onChange={(e) => onChange(e.target.name, e.target.value)}
                inputProps={{ maxLength: 60 }}
            />
            <Autocomplete
                className="mt-6"
                multiple
                disableClearable
                id="types"
                fullWidth
                value={values.accepts}
                onChange={(e, val) => onChange('accepts', val)}
                options={types}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => option.value === value.value}
                noOptionsText={language.dictionary.noAlternatives}
                renderTags={(value, getTagProps) => value.map((option, index) => (
                    <Chip variant="outlined" label={option.label} {...getTagProps({ index })} />
                ))}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={language.dictionary.labelTaskTypes}
                        variant="outlined"
                        required={values.accepts.length === 0}
                    />
                )}
            />
            <div className="mt-6 mb-2">
                <FileDrop
                    required={values.accepts.find((element) => element.value === 'NAME_IMAGE')}
                    accept={['text/csv']}
                    label={language.dictionary.labelUploadGlossary}
                    info={language.dictionary.infoGlossary}
                    files={values.glossary}
                    onUpdate={(files) => onChange('glossary', files)}
                />
            </div>
            {renderSizeInput()}
            <DeadlineSelect
                deadline={values.deadline}
                onChange={(name, val) => onChange(name, val)}
            />
        </>
    );
};

export default TaskAssignmentForm;
