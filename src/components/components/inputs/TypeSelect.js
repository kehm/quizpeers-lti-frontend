import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

/**
 * Render type select input
 */
const TypeSelect = ({
    type, types, label, required, onChange,
}) => (
    <FormControl variant="outlined" fullWidth>
        <InputLabel id="type-label" required={required || false}>
            {label}
        </InputLabel>
        <Select
            labelId="type-label"
            id="type"
            name="type"
            value={type}
            variant="outlined"
            required={required || false}
            label={label}
            fullWidth
            onChange={onChange}
        >
            {types.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);

export default TypeSelect;
