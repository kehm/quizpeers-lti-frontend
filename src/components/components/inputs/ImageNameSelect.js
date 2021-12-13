import React, { useContext } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render select for image name
 */
const ImageNameSelect = ({ value, glossary, onChange }) => {
    const { language } = useContext(LanguageContext);

    return (
        <Autocomplete
            required
            id="solution"
            fullWidth
            value={value ? glossary.find((element) => element === value) || null : null}
            onChange={(e, val) => onChange({ target: { name: 'nameSolution', value: val || '' } })}
            options={glossary || []}
            noOptionsText={language.dictionary.noAlternatives}
            renderInput={(params) => <TextField {...params} label={language.dictionary.labelCorrectAnswer} variant="outlined" required />}
        />
    );
};

export default ImageNameSelect;
