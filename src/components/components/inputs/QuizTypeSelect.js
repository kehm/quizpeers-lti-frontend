import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import LanguageContext from '../../../context/LanguageContext';
import InfoPopover from '../InfoPopover';
import AssignmentList from '../lists/AssignmentList';
import TypeSelect from './TypeSelect';
import SelectButtons from '../buttons/SelectButtons';

/**
 * Render inputs for quiz type
 */
const QuizTypeSelection = ({
    formValues, assignments, onSelect, onChange,
}) => {
    const { language } = useContext(LanguageContext);
    const types = [
        { value: 'DEFINITE', label: language.dictionary.typeDefinite },
        { value: 'RANDOM', label: language.dictionary.typeRandomized },
    ];

    /**
     * Render assignments list
     *
     * @returns JSX
     */
    const renderAssignments = () => {
        const selected = assignments.filter((element) => element.selected);
        return (
            <div className="relative mt-6">
                <h3 className="font-light">{language.dictionary.labelTaskSelection}</h3>
                <span className="absolute -top-3 ml-32">
                    <InfoPopover content={language.dictionary.infoTaskSelection} />
                </span>
                <span className="absolute right-0 top-0">
                    <SelectButtons
                        showSelect={selected.length !== assignments.length}
                        selectDisabled={assignments.length === 0}
                        resetDisabled={assignments.length === 0}
                        onSelect={(val) => onSelect(val)}
                    />
                </span>
                <AssignmentList
                    assignments={assignments}
                    onClickListItem={(id) => onSelect(id)}
                />
                {assignments.length === 0 && <p className="text-red-600">{language.dictionary.noAssignments}</p>}
            </div>
        );
    };

    return (
        <>
            <div className="flex">
                <h2 className="mt-4 mb-8">{language.dictionary.headerStep1}</h2>
                <span className="mt-2">
                    <InfoPopover content={language.dictionary.quizDesc} />
                </span>
            </div>
            <hr className="mb-6" />
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
            <div className="mt-6">
                <TypeSelect
                    type={formValues.type}
                    types={types}
                    label={language.dictionary.labelQuizType}
                    required
                    onChange={onChange}
                />
                {assignments && renderAssignments()}
            </div>
        </>
    );
};

export default QuizTypeSelection;
