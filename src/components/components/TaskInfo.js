import React, { useContext, useEffect, useState } from 'react';
import LanguageContext from '../../context/LanguageContext';
import formatDate from '../../utils/format-date';
import ArrowList from './lists/ArrowList';
import OptionList from './lists/OptionList';
import ThumbnailImage from './ThumbnailImage';
import TypeSelect from './inputs/TypeSelect';

/**
 * Render task info
 */
const TaskInfo = ({ task, showVersionSelect, onChangeType }) => {
    const { language } = useContext(LanguageContext);
    const [content, setContent] = useState(task);
    const [type, setType] = useState('EDIT');
    const types = [
        { value: 'EDIT', label: language.dictionary.labelEdit },
        { value: 'ORIGINAL', label: language.dictionary.labelOriginal },
    ];

    /**
     * Change between original or edited content
     */
    useEffect(() => {
        if (type === 'EDIT' && task.edit) {
            setContent(task.edit);
        } else setContent(task);
    }, [task, type]);

    /**
     * Render options or terms
     *
     * @returns JSX
     */
    const renderAlternatives = () => {
        if (task.type === 'MULTIPLE_CHOICE') {
            return (
                <div className="py-6">
                    <p className="font-light mb-5">
                        {language.dictionary.labelOptions}
                    </p>
                    <OptionList
                        options={content.options}
                        selected={content.solution}
                    />
                </div>
            );
        }
        if (task.type === 'COMBINE_TERMS') {
            return (
                <div className="py-6">
                    <p className="font-light mb-5">
                        {language.dictionary.labelTerms}
                    </p>
                    <ArrowList
                        taskId={task.id}
                        options={content.options}
                        relations={Array.isArray(content.solution) ? content.solution : []}
                        coloredArrows
                    />
                </div>
            );
        }
        if (task.type === 'NAME_IMAGE') {
            return (
                <div className="py-6">
                    <ThumbnailImage
                        mediaId={task.options[0]}
                        alt="Task illustration"
                    />
                    <p className="my-6">
                        {`${language.dictionary.labelCorrectAnswer}: `}
                        <span className="font-bold">{task.solution}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    /**
     * Render select for original/edited task version
     *
     * @returns JSX
     */
    const renderEditSelect = () => (
        <span className="block mt-4 mb-6">
            <TypeSelect
                type={type}
                types={types}
                label={language.dictionary.labelVersion}
                onChange={(e) => {
                    setType(e.target.value);
                    onChangeType(e.target.value);
                }}
            />
        </span>
    );

    return (
        <div className="p-2 mb-4">
            <dl className="py-6 grid">
                <dt className="col-start-1 font-light">{language.dictionary.labelCreated}</dt>
                <dd className="col-start-2">{formatDate(task.created_at)}</dd>
                <dt className="col-start-1 font-light">{language.dictionary.labelType}</dt>
                <dd className="col-start-2">
                    {task.type === 'MULTIPLE_CHOICE' && language.dictionary.multipleChoice}
                    {task.type === 'COMBINE_TERMS' && language.dictionary.termsTask}
                    {task.type === 'NAME_IMAGE' && language.dictionary.nameImage}
                </dd>
            </dl>
            {showVersionSelect && task.edit && renderEditSelect()}
            <h2 className="mt-6">{content.title}</h2>
            <p className="mb-8 mt-2 break-words">{content.description}</p>
            {(content.media_id || content.mediaId) && (
                <ThumbnailImage
                    mediaId={content.media_id || content.mediaId}
                    alt="Task illustration"
                />
            )}
            {renderAlternatives()}
        </div>
    );
};

export default TaskInfo;
