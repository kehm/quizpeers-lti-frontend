import 'date-fns';
import React, { useContext } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render date picker input
 */
const DatePicker = ({ date, onChange }) => {
    const { language } = useContext(LanguageContext);

    return (
        <div className="mb-6 mr-8">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justifyContent="space-around">
                    <KeyboardDatePicker
                        id="date-picker"
                        label={language.dictionary.labelDatePicker}
                        format="dd/MM/yyyy"
                        value={date}
                        onChange={onChange}
                        KeyboardButtonProps={{ 'aria-label': 'change date' }}
                        required
                        autoComplete="off"
                    />
                    <KeyboardTimePicker
                        id="time-picker"
                        label={language.dictionary.labelTimePicker}
                        value={date}
                        onChange={onChange}
                        KeyboardButtonProps={{ 'aria-label': 'change time' }}
                        required
                        autoComplete="off"
                    />
                </Grid>
            </MuiPickersUtilsProvider>
        </div>
    );
};

export default DatePicker;
