import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LanguageContext from '../../../context/LanguageContext';
import InfoPopover from '../InfoPopover';

/**
 * Render inputs for task evaluation
 */
const TaskEvaluation = ({
    formValues, submissionStatus, groups, onChange,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render input for task group
     *
     * @returns JSX
     */
    const renderGroupSelect = () => (
        <Autocomplete
            id="groupId"
            disabled={!formValues.include}
            fullWidth
            value={formValues.groupId
                ? groups.find((element) => element.id === formValues.groupId) || null : null}
            onChange={(e, val) => onChange({ target: { name: 'groupId', value: val ? val.id : '' } })}
            options={groups || []}
            getOptionLabel={(option) => {
                if (option) return option.name;
                return '';
            }}
            noOptionsText={language.dictionary.noAlternatives}
            renderInput={(params) => <TextField {...params} label={language.dictionary.labelTaskGroup} variant="outlined" />}
        />
    );

    return (
        <div className="relative">
            <FormControlLabel
                className="mb-2"
                control={(
                    <Checkbox
                        checked={formValues.include}
                        onChange={() => onChange({ target: { name: 'include', value: !formValues.include } })}
                        name="include"
                    />
                )}
                label={language.dictionary.labelIncludeTask}
            />
            <span className="absolute right-2">
                <InfoPopover content={language.dictionary.infoTaskGroup} />
            </span>
            {renderGroupSelect()}
            <div className="mt-8 pb-10">
                {submissionStatus !== 'EVALUATED_PUBLISHED' && (
                    <div className="w-36 absolute bottom-0">
                        <TextField
                            autoComplete="off"
                            fullWidth
                            id="score"
                            name="score"
                            type="number"
                            label={language.dictionary.labelScore}
                            variant="outlined"
                            value={formValues.score}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (val > -1 && val <= 10) {
                                    onChange({ target: { name: 'score', value: e.target.value } });
                                }
                            }}
                            inputProps={{ min: 0, max: 10 }}
                        />
                    </div>
                )}
                <span className="absolute bottom-0 right-4">
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="large"
                        endIcon={<SaveOutlined />}
                    >
                        {language.dictionary.btnSave}
                    </Button>
                </span>
            </div>
        </div>
    );
};

export default TaskEvaluation;
