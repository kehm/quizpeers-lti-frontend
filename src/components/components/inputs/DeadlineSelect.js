import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LanguageContext from '../../../context/LanguageContext';
import InfoPopover from '../InfoPopover';
import DatePicker from './DatePicker';

/**
 * Render view for assignment deadline
 */
const DeadlineSelect = ({
    deadline, timer, timerChecked, onChange, showTimer,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Set timer array
     *
     * @param {int} index Array index
     * @param {int} value Time value
     */
    const setTimerLength = (index, value) => {
        value = parseInt(value, 10);
        if ((index === 0 && value > -1 && value < 9999)
            || (index === 1 && value > -1 && value < 60)) {
            const arr = [...timer];
            arr[index] = value;
            onChange('timer', arr);
        }
    };

    /**
     * Render timer selection view
     */
    const renderTimerSelect = () => (
        <div className="mt-6 flex">
            <div className="w-24 float-left mr-2">
                <TextField
                    fullWidth
                    id="timerHours"
                    name="timerHours"
                    type="number"
                    label={language.dictionary.timerHours}
                    variant="outlined"
                    value={timer[0]}
                    onChange={(e) => setTimerLength(0, e.target.value, 10)}
                    inputProps={{ min: 0, max: 9999 }}
                />
            </div>
            <div className="w-24 float-left">
                <TextField
                    fullWidth
                    id="timerMins"
                    name="timerMins"
                    type="number"
                    label={language.dictionary.timerMins}
                    variant="outlined"
                    value={timer[1]}
                    onChange={(e) => setTimerLength(1, e.target.value)}
                    inputProps={{ min: 0, max: 59 }}
                />
            </div>
        </div>
    );

    return (
        <div className="relative py-4">
            <span className="absolute -left-10">
                <InfoPopover content={language.dictionary.infoDeadline} />
            </span>
            <DatePicker
                date={deadline}
                onChange={(value) => onChange('deadline', value)}
            />
            {showTimer && (
                <>
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={timerChecked}
                                onChange={() => onChange('timerChecked', !timerChecked)}
                                name="use-timer"
                            />
                        )}
                        label={language.dictionary.setTimer}
                    />
                    {timerChecked && renderTimerSelect()}
                </>
            )}
        </div>
    );
};

export default DeadlineSelect;
