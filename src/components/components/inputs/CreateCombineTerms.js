import React, { useContext } from 'react';
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../../context/LanguageContext';
import InfoPopover from '../InfoPopover';
import TaskDescription from './TaskDescription';
import TermList from '../lists/TermList';

/**
 * Render inputs for creating a combine terms task
 */
const CreateCombineTerms = ({
    formValues, onChange,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Add, change or remove a term
     *
     * @param {Object} term Term object (True/false for add/remove)
     * @param {int} index Term index
     */
    const handleChangeTerm = (term, index) => {
        const arr = [...formValues.termPairs];
        if (term === true) {
            arr.push({
                term: { type: 'TEXT', term: undefined },
                relatedTerm: { type: 'TEXT', term: undefined },
            });
        } else if (term === false) {
            arr.splice(index, 1);
        } else arr[index] = term;
        onChange({ target: { name: 'termPairs', value: arr } });
    };

    return (
        <div className="px-4">
            <p className="my-6">{language.dictionary.termsTaskDesc}</p>
            <TaskDescription
                formValues={formValues}
                onChange={onChange}
                descriptionRequired
            />
            <div className="relative my-6">
                <span className="absolute -left-10 -top-3">
                    <InfoPopover content={language.dictionary.infoTermTasks} />
                </span>
                <span className="absolute right-0">
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={<Add />}
                        onClick={() => handleChangeTerm(true)}
                        disabled={formValues.termPairs.length === 6}
                    >
                        {language.dictionary.btnNew}
                    </Button>
                </span>
            </div>
            <h3 className="font-bold mb-6">{language.dictionary.labelTerms}</h3>
            <TermList
                termPairs={formValues.termPairs}
                onChange={(index, term) => handleChangeTerm(term, index)}
                onRemove={(index) => handleChangeTerm(false, index)}
            />
        </div>
    );
};

export default CreateCombineTerms;
