import React, { useContext } from 'react';
import RotateLeft from '@material-ui/icons/RotateLeft';
import Button from '@material-ui/core/Button';
import LanguageContext from '../../../context/LanguageContext';
import InfoPopover from '../InfoPopover';
import TaskList from '../lists/TaskList';

/**
 * Render inputs for task difficulties
 */
const DifficultySelection = ({
    type, tasks, onChangeDifficulty, onChangeIndex,
}) => {
    const { language } = useContext(LanguageContext);

    return (
        <>
            <div className="flex">
                <h2 className="mt-4 mb-8">{language.dictionary.headerStep3}</h2>
                <span className="mt-2">
                    <InfoPopover content={language.dictionary.weightsDesc} />
                </span>
            </div>
            <hr className="mb-6" />
            <dl className="grid mb-8">
                <dt className="col-start-1 font-bold">
                    {language.dictionary.labelType}
                </dt>
                <dd className="col-start-2">
                    {type === 'DEFINITE' ? language.dictionary.typeDefinite : language.dictionary.typeRandomized}
                </dd>
            </dl>
            <span className="absolute right-0">
                <Button
                    variant="contained"
                    color="default"
                    size="medium"
                    endIcon={<RotateLeft />}
                    onClick={() => onChangeDifficulty()}
                >
                    {language.dictionary.btnResetLevels}
                </Button>
            </span>
            <div className="mt-20">
                <TaskList
                    tasks={tasks}
                    editable={type === 'DEFINITE'}
                    onChangeSlider={(val, task) => onChangeDifficulty(val, task)}
                    onChangeIndex={(index, newIndex) => onChangeIndex(index, newIndex)}
                />
            </div>
        </>
    );
};

export default DifficultySelection;
