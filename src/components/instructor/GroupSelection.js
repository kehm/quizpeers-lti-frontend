import React, { useContext } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import LanguageContext from '../../context/LanguageContext';
import InfoPopover from '../components/InfoPopover';
import LevelSelect from '../components/inputs/LevelSelect';
import TaskList from '../components/lists/TaskList';

/**
 * Render view for setting the number of tasks from each group for a quiz
 */
const GroupSelection = ({
    groups, groupInfo, sizes, weights, onChange, onChangeWeight,
}) => {
    const { language } = useContext(LanguageContext);

    /**
     * Set initial group weights
     */
    const handleCheckWeights = () => {
        const tmpWeights = {};
        if (Object.keys(weights).length === 0) {
            Object.keys(groups).forEach((groupId) => {
                tmpWeights[groupId] = 1;
            });
        }
        onChangeWeight(undefined, tmpWeights);
    };

    /**
     * Render weight input
     *
     * @param {int} groupId Group ID
     * @returns JSX
     */
    const renderWeight = (groupId) => (
        <div className="w-32 ml-2 my-4">
            <TextField
                autoComplete="off"
                fullWidth
                id={`weight-${groupId}`}
                name={`weight-${groupId}`}
                type="number"
                label={language.dictionary.labelWeight}
                variant="outlined"
                value={weights[groupId] || 1}
                onChange={(e) => onChangeWeight(groupId, e.target.value)}
                inputProps={{ min: 1, max: 100 }}
            />
        </div>
    );

    /**
     * Render task groups
     *
     * @returns JSX
     */
    const renderGroups = () => Object.entries(groups).map((group) => {
        const [groupId, groupTasks] = group;
        let groupName = language.dictionary.labelNoGroup;
        const info = groupInfo.find((element) => element.id === parseInt(groupId, 10));
        if (info) groupName = info.name;
        const arr = [0, 0, 0];
        groupTasks.forEach((task) => { arr[task.difficulty - 1] += 1; });
        const size = sizes[groupId];
        return (
            <div
                key={groupId}
                className="pb-4"
            >
                <h3 className="font-bold mt-8 ml-2">{`${groupName}:`}</h3>
                {Object.keys(weights).length > 0 && renderWeight(groupId)}
                <div className="flex mt-6 mb-4 ml-2">
                    <LevelSelect
                        levels={[0, 1, 2]}
                        levelSizes={arr}
                        values={size || [0, 0, 0]}
                        onChange={(groupSize) => onChange(groupId, groupSize)}
                    />
                </div>
                <TaskList
                    tasks={groupTasks}
                    disableSlider
                />
            </div>
        );
    });

    return groups && groupInfo ? (
        <>
            <div className="flex">
                <h2 className="mt-2">{language.dictionary.headerSelectByGroup}</h2>
                <InfoPopover content={language.dictionary.infoGroups} />
            </div>
            <div className="flex">
                <FormControlLabel
                    control={(
                        <Checkbox
                            checked={Object.keys(weights).length > 0}
                            onChange={() => handleCheckWeights()}
                            name="use-weights"
                        />
                    )}
                    label={language.dictionary.labelSetWeights}
                />
                <InfoPopover content={language.dictionary.infoWeights} />
            </div>
            {renderGroups()}
        </>
    ) : null;
};

export default GroupSelection;
