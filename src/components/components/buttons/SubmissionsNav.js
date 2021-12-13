import React, { useContext } from 'react';
import LanguageContext from '../../../context/LanguageContext';
import BackButton from './BackButton';
import NextButton from './NextButton';

/**
 * Render submissions navigation buttons
 */
const SubmissionsNav = ({
    index, tab, total, lengthPending, onNext,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Check if there is a next submission or not
     *
     * @returns {boolean} True if disable next submission button
     */
    const isNextDisabled = () => {
        if (tab === 0 && lengthPending === index + 1) {
            return true;
        }
        if (tab === 1 && total === index + 1) {
            return true;
        }
        if (tab === 2) return true;
        return false;
    };

    return (
        <div className="relative flex my-4">
            <BackButton
                label={language.dictionary.btnPrevSubmission}
                onClick={() => onNext(index - 1)}
                disabled={(tab === 0 && index === 0)
                    || (tab === 1 && index === lengthPending)}
            />
            <span className="absolute right-4">
                <NextButton
                    label={language.dictionary.btnNextSubmission}
                    onClick={() => onNext(index + 1)}
                    disabled={isNextDisabled()}
                />
            </span>
        </div>
    );
};

export default SubmissionsNav;
