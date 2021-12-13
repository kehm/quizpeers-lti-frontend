import React, { useContext } from 'react';
import Dropzone from 'react-dropzone';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import HighlightOffOutlined from '@material-ui/icons/HighlightOffOutlined';
import IconButton from '@material-ui/core/IconButton';
import LanguageContext from '../../../context/LanguageContext';
import InfoPopover from '../InfoPopover';

/**
 * Render file dropzone
 */
const FileDrop = ({
    required, accept, label, info, files, exists, onUpdate,
}) => {
    const { language } = useContext(LanguageContext);
    const maxFiles = 1;

    /**
     * Add new dropped files to file array
     *
     * @param {Array} dropped New dropped files
     */
    const handleDropFiles = (dropped) => {
        let arr = [...files];
        if (arr.length + dropped.length <= maxFiles) {
            arr = arr.concat(dropped.map((file) => Object.assign(file)));
            onUpdate(arr);
        }
    };

    /**
     * Remove file from array
     *
     * @param {Object} e Event
     * @param {int} index File index
     */
    const handleRemoveFile = (e, index) => {
        e.stopPropagation();
        const arr = [...files];
        arr.splice(index, 1);
        onUpdate(arr);
    };

    /**
     * Render file item
     *
     * @param {Object} file File
     * @param {int} index File index
     * @returns List item
     */
    const renderFileItem = (file, index) => (
        <li key={index}>
            <div className="flex items-center py-2">
                <p className="w-44 overflow-hidden overflow-ellipsis whitespace-nowrap">{file.name}</p>
                <span className="absolute right-6">
                    <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={(e) => handleRemoveFile(e, index)}
                    >
                        <HighlightOffOutlined />
                    </IconButton>
                </span>
            </div>
        </li>
    );

    /**
     * Render files array
     *
     * @param {Array} arr Files array
     * @returns JSX
     */
    const renderFiles = (arr) => (
        <>
            <h3 className="font-semibold text-sm">
                {language.dictionary.selectedFile}
            </h3>
            <ul className="list-disc ml-6">
                {arr.map((file, index) => renderFileItem(file, index))}
            </ul>
        </>
    );

    /**
     * Render dropzone label
     *
     * @returns JSX
     */
    const renderLabel = () => {
        if (exists) return renderFiles([{ name: language.dictionary.labelUploadedImage }]);
        return <p className="mt-8 mb-2 text-sm">{language.dictionary.dragAndDrop}</p>;
    };

    return (
        <FormControl
            variant="filled"
            fullWidth
            required={required || false}
        >
            {info && (
                <span className="absolute -left-10 top-0">
                    <InfoPopover content={info} />
                </span>
            )}
            {(files.length === 0 && !exists) && (
                <InputLabel id="file-drop-label">{label}</InputLabel>
            )}
            <Dropzone
                onDrop={(dropped) => handleDropFiles(dropped)}
                accept={accept}
                multiple={maxFiles !== 1}
                maxFiles={maxFiles}
                maxSize={parseInt(process.env.REACT_APP_MAX_FILE_SIZE, 10)}
                disabled={files.length > 0 || exists}
            >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div
                            className="bg-white p-2 mb-4 border border-solid border-gray-300 rounded cursor-pointer text-gray-700"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            {files.length === 0 ? renderLabel() : renderFiles(files)}
                        </div>
                    </section>
                )}
            </Dropzone>
        </FormControl>
    );
};

export default FileDrop;
