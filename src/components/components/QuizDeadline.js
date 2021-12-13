import React, { useContext } from 'react';
import SaveOutlined from '@material-ui/icons/SaveOutlined';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../context/LanguageContext';
import DeadlineSelect from './inputs/DeadlineSelect';
import InfoPopover from './InfoPopover';

/**
 * Render quiz deadline form
 */
const QuizDeadline = ({ values, error, onChange }) => {
    const { language } = useContext(LanguageContext);

    let ready = true;
    if (!values.deadline || error) ready = false;
    if (values.timerChecked) {
        if (!values.timer) {
            ready = false;
        } else if (values.timer[0] === 0 && values.timer[1] === 0) {
            ready = false;
        }
    }
    return (
        <>
            <div className="flex">
                <h2 className="mt-4 mb-8">{`${values.type === 'RANDOM' ? language.dictionary.headerStep5 : language.dictionary.headerStep4}: ${language.dictionary.headerDeadline}`}</h2>
                <span className="mt-2">
                    <InfoPopover content={language.dictionary.deadlineDesc} />
                </span>
            </div>
            <hr className="mb-6" />
            <DeadlineSelect
                deadline={values.deadline}
                timer={values.timer}
                timerChecked={values.timerChecked}
                onChange={(name, val) => onChange(name, val)}
                showTimer
            />
            {error && <p className="text-red-600">{language.dictionary.errorDeadline}</p>}
            <span className="absolute bottom-0 right-0">
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<SaveOutlined />}
                    disabled={!ready}
                >
                    {language.dictionary.btnSave}
                </Button>
            </span>
        </>
    );
};

export default QuizDeadline;
