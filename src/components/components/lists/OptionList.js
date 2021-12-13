import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Remove from '@material-ui/icons/Remove';
import Checkbox from '@material-ui/core/Checkbox';
import LanguageContext from '../../../context/LanguageContext';

/**
 * Render option list
 */
const OptionList = ({
    options, selectable, interactive, selected, onChangeOption, onSelectOption, onRemove,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Render option inputs
     *
     * @param {Object} option Option object
     * @param {int} index Option index
     * @returns JSX
     */
    const renderOption = (option, index) => {
        if (interactive) {
            return (
                <span className="block w-full px-1 lg:px-3">
                    <TextField
                        autoComplete="off"
                        required
                        id={`option${index}`}
                        name={`option${index}`}
                        type="text"
                        label={`${language.dictionary.labelOption} #${index + 1}`}
                        variant="outlined"
                        fullWidth
                        value={option}
                        onChange={(e) => onChangeOption(index, e.target.value)}
                        inputProps={{ maxLength: 200 }}
                    />
                </span>
            );
        }
        return <p className="break-words">{option.option}</p>;
    };

    return (
        <div className="overflow-y-auto px-2 mb-4">
            <List>
                {Array.isArray(options) && options.map((option, index) => (
                    <ListItem
                        key={option.id || index}
                        className={`rounded h-24 mb-2 shadow-md ${(interactive || selectable) && 'bg-gray-100'} ${(!interactive && selectable) && 'cursor-pointer hover:bg-blue-100'}`}
                        onClick={() => {
                            if (selectable && !interactive) onSelectOption(option.id);
                        }}
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={(interactive && selected === index)
                                    || (!interactive && selected === option.id)}
                                disabled={!selectable}
                                onChange={() => {
                                    if (selectable && interactive) onSelectOption(index);
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText primary={renderOption(option, index)} />
                        {interactive && (
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="minus"
                                    color="primary"
                                    onClick={() => onRemove(index)}
                                    disabled={options.length === 2}
                                >
                                    <Remove />
                                </IconButton>
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default OptionList;
