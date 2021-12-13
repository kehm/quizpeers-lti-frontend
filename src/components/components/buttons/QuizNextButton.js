import React, { useContext } from 'react';
import NavigateNext from '@material-ui/icons/NavigateNext';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render next button
 */
const QuizNextButton = ({
    values, step, assignments, tasks, onClick,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Check if ready to go to next step
     *
     * @returns {boolean} True if ready
     */
    const isReady = () => {
        if (step === 0) {
            if (values.title === '' || values.type === '') return false;
            if (assignments.filter((element) => element.selected).length < 1) return false;
            return true;
        }
        if (step === 1) {
            if (tasks.filter((task) => task.selected).length === 0) return false;
            return true;
        }
        if (step === 3) {
            if ((values.selectionType === '' || values.selectionType === 'DIFFICULTY') && values.size.every((val) => val === 0)) {
                return false;
            }
            if (values.selectionType === 'GROUP') {
                const selected = Object.values(values.groupSizes).filter(
                    (sizes) => !sizes.every((val) => val === 0),
                );
                if (selected.length === 0) return false;
            }
            const groups = Object.keys(values.groupSizes);
            const weights = Object.values(values.weights);
            if (weights.length > 0) {
                if (weights.length !== groups.length) return false;
                let sum = 0;
                weights.forEach((weight) => { sum += weight; });
                if (sum !== 100) return false;
            }
            return true;
        }
        return true;
    };

    return (
        <span className="absolute bottom-0 right-0">
            <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<NavigateNext />}
                onClick={() => onClick()}
                disabled={!isReady()}
            >
                {language.dictionary.btnNext}
            </Button>
        </span>
    );
};

export default QuizNextButton;
