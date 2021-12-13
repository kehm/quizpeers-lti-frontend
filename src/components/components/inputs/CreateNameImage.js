import React, { useContext } from 'react';
import LanguageContext from '../../../context/LanguageContext';
import FileDrop from './FileDrop';
import TaskDescription from './TaskDescription';
import ImageNameSelect from './ImageNameSelect';

/**
 * Render inputs for creating a name image task
 */
const CreateNameImage = ({ glossary, formValues, onChange }) => {
    const { language } = useContext(LanguageContext);
    const fileTypes = 'image/jpeg, image/png';

    return (
        <div className="px-4">
            <p className="my-6">{language.dictionary.nameImageDescription}</p>
            <TaskDescription
                formValues={formValues}
                onChange={onChange}
            />
            <div className="mt-6 mb-2">
                <FileDrop
                    required
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
            <ImageNameSelect
                value={formValues.nameSolution}
                glossary={glossary}
                onChange={onChange}
            />
        </div>
    );
};

export default CreateNameImage;
