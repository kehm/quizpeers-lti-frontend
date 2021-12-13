import React, { useContext } from 'react';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render select/reset buttons
 */
const SelectButtons = ({
    showSelect, selectDisabled, resetDisabled, resetLabel, onSelect,
}) => {
    const { language } = useContext(LanguageContext);

    if (showSelect) {
        return (
            <Button
                variant="contained"
                color={resetLabel ? 'secondary' : 'primary'}
                size="medium"
                endIcon={<Add />}
                onClick={() => onSelect(true)}
                disabled={selectDisabled || false}
            >
                {language.dictionary.btnSelectAll}
            </Button>
        );
    }
    return (
        <Button
            variant="contained"
            color="default"
            size="medium"
            endIcon={<Remove />}
            onClick={() => onSelect(false)}
            disabled={resetDisabled || false}
        >
            {resetLabel || language.dictionary.btnResetSelected}
        </Button>
    );
};

export default SelectButtons;
