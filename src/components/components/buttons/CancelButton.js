import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render cancel button
 */
const CancelButton = ({ step, onCancel, onPrev }) => {
    const { language } = useContext(LanguageContext);

    if (step === 0) {
        return (
            <Button
                variant="text"
                color="default"
                size="large"
                startIcon={<Close />}
                onClick={() => onCancel()}
            >
                {language.dictionary.btnCancel}
            </Button>
        );
    }
    return (
        <Button
            variant="contained"
            color="default"
            size="large"
            startIcon={<NavigateBefore />}
            onClick={() => onPrev()}
        >
            {language.dictionary.btnPrev}
        </Button>
    );
};

export default CancelButton;
