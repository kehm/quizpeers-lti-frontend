import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Remove from '@material-ui/icons/Remove';
import LanguageContext from '../../context/LanguageContext';
import ArrowList from './lists/ArrowList';
import ThumbnailImage from './ThumbnailImage';
import TypeSelect from './inputs/TypeSelect';

/**
 * Render combine terms task for quiz
 */
const CombineTermsTask = ({
    task, values, solution, isTeacher, selectable, onChangeAnswer,
}) => {
    const { language } = useContext(LanguageContext);
    const [selected, setSelected] = useState({ termId: undefined, isEven: undefined });
    const [type, setType] = useState('ANSWER');
    const types = [
        { value: 'ANSWER', label: language.dictionary.labelAnswer },
        { value: 'SOLUTION', label: language.dictionary.headerSolution },
    ];

    /**
     * Set selected term and update relations if two terms are selected
     *
     * @param {int} termId Term ID
     * @param {boolean} isEven True if term is in the even column
     */
    const handleSelectTerm = (termId, isEven) => {
        let arr = [];
        if (values) arr = values;
        if (selected.termId) {
            if (selected.isEven === isEven) {
                setSelected({ termId, isEven });
            } else {
                arr = arr.filter((element) => {
                    if (element[0] === termId || element[1] === termId
                        || element[0] === selected.termId || element[1] === selected.termId) {
                        return false;
                    }
                    return true;
                });
                arr.push(
                    [
                        isEven ? termId : selected.termId,
                        isEven ? selected.termId : termId,
                    ],
                );
                onChangeAnswer(arr);
                setSelected({ termId: undefined, isEven: undefined });
            }
        } else setSelected({ termId, isEven });
    };

    /**
     * Render warning if no answers are selected
     *
     * @param renderClear True if render clear answers button
     * @returns JSX
     */
    const renderNoAnswer = (renderClear) => {
        if (values) {
            if (renderClear) {
                return (
                    <span className="block pt-4 pb-8">
                        <Button
                            variant="contained"
                            color="default"
                            size="medium"
                            endIcon={<Remove />}
                            onClick={() => onChangeAnswer(undefined)}
                        >
                            {language.dictionary.btnResetSelected}
                        </Button>
                    </span>
                );
            }
            return null;
        }
        return <h3 className="font-bold text-red-600 pt-4 pb-8">{language.dictionary.noAnswer}</h3>;
    };

    return (
        <>
            <div className="p-4 border-2 border-solid rounded my-4">
                <h2>{task.edit ? task.edit.title : task.title}</h2>
                <div className="mt-4 mb-6">
                    <p className="break-words">{task.edit ? task.edit.description : task.description}</p>
                    {task.media_id && (
                        <ThumbnailImage
                            mediaId={task.media_id}
                            alt="Task illustration"
                        />
                    )}
                </div>
                <h3 className="font-light">{language.dictionary.headerConnectTerms}</h3>
                {solution && !isTeacher && (
                    <div className="mt-4">
                        <TypeSelect
                            type={type}
                            types={types}
                            label={language.dictionary.labelShow}
                            onChange={(e) => setType(e.target.value)}
                        />
                    </div>
                )}
                <ArrowList
                    taskId={task.id}
                    options={task.options}
                    relations={type === 'SOLUTION' ? solution : values}
                    solution={solution}
                    selected={selected.termId}
                    selectable={selectable}
                    coloredArrows={type !== 'SOLUTION'}
                    onClickListItem={(termId, isEven) => handleSelectTerm(termId, isEven)}
                />
                {!selectable && renderNoAnswer(false)}
            </div>
            {selectable && renderNoAnswer(true)}
        </>
    );
};

export default CombineTermsTask;
