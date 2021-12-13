import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render select inputs for levels
 */
const LevelSelect = ({
    levels, levelSizes, values, onChange,
}) => {
    const { language } = useContext(LanguageContext);

    return levels && levelSizes ? levels.map((level) => (
        <div
            key={level}
            className="mr-2 inline-block w-32"
        >
            <TextField
                autoComplete="off"
                fullWidth
                id={`difficulty-${level + 1}`}
                name={`difficulty-${level + 1}`}
                type="number"
                label={`${language.dictionary.labelLevel} ${level + 1} (${language.dictionary.labelMax}. ${levelSizes[level]})`}
                variant="outlined"
                value={values[level]}
                onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (val > -1 && val <= levelSizes[level]) {
                        const arr = [...values];
                        arr[level] = val;
                        onChange(arr);
                    }
                }}
                inputProps={{ min: 0, max: levelSizes[level] }}
                disabled={levelSizes[level] === 0}
            />
        </div>
    )) : null;
};

export default LevelSelect;
