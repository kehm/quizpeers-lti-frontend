import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Remove from '@material-ui/icons/Remove';
import LanguageContext from '../../../context/LanguageContext';
import FileDrop from '../inputs/FileDrop';
import TypeSelect from '../inputs/TypeSelect';

/**
 * Render term list
 */
const TermList = ({
    termPairs, onChange, onRemove,
}) => {
    const { language } = useContext(LanguageContext);
    const fileTypes = 'image/jpeg, image/png';
    const types = [
        { value: 'TEXT', label: language.dictionary.labelText },
        { value: 'IMAGE', label: language.dictionary.labelImage },
    ];

    /**
     * Render term type input
     *
     * @returns JSX
     */
    const renderTypeSelect = (pair, name, index) => (
        <TypeSelect
            type={pair[name].type}
            types={types}
            label={language.dictionary.labelTermType}
            required
            onChange={(e) => {
                pair[name].term = undefined;
                pair[name].type = e.target.value;
                onChange(index, pair);
            }}
        />
    );

    /**
     * Render text inputs for both terms
     *
     * @param {Object} term Term
     * @param {int} index Index
     * @returns JSX
     */
    const renderTextInput = (pair, name, index) => (
        <>
            {renderTypeSelect(pair, name, index)}
            <span className="block mt-4 mb-8">
                <TextField
                    autoComplete="off"
                    required
                    id={`term${index}`}
                    name={`term${index}`}
                    type="text"
                    label={language.dictionary.term1}
                    variant="outlined"
                    fullWidth
                    value={pair[name].term || ''}
                    onChange={(e) => {
                        pair[name].term = e.target.value;
                        onChange(index, pair);
                    }}
                    inputProps={{ maxLength: 200 }}
                />
            </span>
        </>
    );

    /**
     * Render file inputs for both terms
     *
     * @param {Object} term Term
     * @returns JSX
     */
    const renderFileInput = (pair, name, index) => (
        <>
            {renderTypeSelect(pair, name, index)}
            <span className="block my-4">
                <FileDrop
                    required
                    accept={fileTypes}
                    exists={pair[name].type === 'IMAGE' && pair[name].term !== undefined}
                    label={language.dictionary.labelTermImage}
                    info={language.dictionary.infoImage}
                    files={Array.isArray(pair[name].term) ? pair[name].term : []}
                    onUpdate={(files) => {
                        if (files.length === 0) {
                            pair[name].term = undefined;
                        } else pair[name].term = files;
                        onChange(index, pair);
                    }}
                />
            </span>
        </>
    );

    /**
     * Render list item content based on the selected type
     *
     * @param {Object} pair Term pair
     * @param {string} name Term name
     * @param {int} index Pair index
     * @returns JSX
     */
    const renderContent = (pair, name, index) => {
        if (pair[name].type === 'IMAGE') return renderFileInput(pair, name, index);
        return renderTextInput(pair, name, index);
    };

    return (
        <div className="overflow-y-auto px-2 mb-4">
            <List>
                {termPairs.map((pair, index) => (
                    <ListItem
                        key={index}
                        className="rounded bg-gray-100 mb-2 shadow-md h-96"
                    >
                        <ListItemText primary={(
                            <div className="mt-4 ml-6 mr-4">
                                {renderContent(pair, 'term', index)}
                                {renderContent(pair, 'relatedTerm', index)}
                            </div>
                        )}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="minus"
                                color="primary"
                                onClick={() => onRemove(index)}
                                disabled={termPairs.length === 2}
                            >
                                <Remove />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default TermList;
