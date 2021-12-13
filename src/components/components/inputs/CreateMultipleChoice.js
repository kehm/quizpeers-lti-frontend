import React, { useContext } from 'react';
import Add from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../../context/LanguageContext';
import FileDrop from './FileDrop';
import InfoPopover from '../InfoPopover';
import OptionList from '../lists/OptionList';
import TaskDescription from './TaskDescription';

/**
 * Render inputs for creating a multiple choice task
 */
const CreateMultipleChoice = ({
    formValues, onChange, onChangeOption, onAddOption, onRemoveOption,
}) => {
    const { language } = useContext(LanguageContext);
    const fileTypes = 'image/jpeg, image/png';

    return (
        <div className="px-4">
            <p className="my-6">{language.dictionary.multipleChoiceDesc}</p>
            <TaskDescription
                formValues={formValues}
                onChange={onChange}
                descriptionRequired
            />
            <div className="mt-6">
                <FileDrop
                    accept={fileTypes}
                    label={language.dictionary.labelUploadImage}
                    info={language.dictionary.infoImage}
                    files={formValues.image}
                    exists={formValues.mediaId !== undefined}
                    onUpdate={(files) => {
                        if (formValues.mediaId !== undefined) {
                            onChange({ target: { name: 'mediaId', value: undefined } });
                        } else onChange({ target: { name: 'image', value: files } });
                    }}
                />
            </div>
            <div className="relative my-2">
                <span className="absolute -left-10 -top-3">
                    <InfoPopover content={language.dictionary.infoOptions} />
                </span>
                <span className="absolute right-0">
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        endIcon={<Add />}
                        onClick={() => onAddOption()}
                        disabled={formValues.options.length === 6}
                    >
                        {language.dictionary.btnNew}
                    </Button>
                </span>
                <h3 className="font-bold mb-6">{language.dictionary.labelOptions}</h3>
                <OptionList
                    options={formValues.options}
                    selected={formValues.indexSolution}
                    interactive
                    selectable
                    onRemove={(index) => onRemoveOption(index)}
                    onChangeOption={(index, value) => onChangeOption(index, value)}
                    onSelectOption={(index) => onChange({ target: { name: 'indexSolution', value: index } })}
                />
                <p>
                    {language.dictionary.selectedOption}
                    {formValues.indexSolution + 1}
                    {language.dictionary.selectedOption2}
                </p>
            </div>
        </div>
    );
};

export default CreateMultipleChoice;
