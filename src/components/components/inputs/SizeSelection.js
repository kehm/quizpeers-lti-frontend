import React, { useContext, useEffect, useState } from 'react';
import LanguageContext from '../../../context/LanguageContext';
import GroupSelection from '../../instructor/GroupSelection';
import InfoPopover from '../InfoPopover';
import TypeSelect from './TypeSelect';
import { getTaskGroupInfo } from '../../../utils/api/tasks';
import LevelSelect from './LevelSelect';

/**
 * Render inputs for quiz size
 */
const SizeSelection = ({
    formValues, tasks, onChangeSize, onChangeGroupSize, onChangeType, onChangeWeight,
}) => {
    const { language } = useContext(LanguageContext);
    const [taskNumbers, setTaskNumbers] = useState(undefined);
    const [groups, setGroups] = useState(undefined);
    const [groupInfo, setGroupInfo] = useState(undefined);
    const types = [
        { value: 'DIFFICULTY', label: language.dictionary.labelDifficulty },
        { value: 'GROUP', label: language.dictionary.labelGroup },
    ];

    /**
     * Count number of tasks from each level and set task groups
     */
    useEffect(() => {
        if (!taskNumbers) {
            const arr = [0, 0, 0];
            let groupIds = new Set();
            const nullGroup = [];
            const tmpGroups = {};
            tasks.forEach((task) => {
                arr[task.difficulty - 1] += 1;
                if (task.task_group_id) {
                    groupIds.add(task.task_group_id);
                    if (Array.isArray(tmpGroups[task.task_group_id])) {
                        tmpGroups[task.task_group_id].push(task);
                    } else tmpGroups[task.task_group_id] = [task];
                } else nullGroup.push(task);
            });
            if (nullGroup.length > 0) tmpGroups.null = nullGroup;
            setGroups(tmpGroups);
            groupIds = Array.from(groupIds);
            if (groupIds.length > 0) {
                const getGroupInfo = async () => {
                    const tmpGroupInfo = await getTaskGroupInfo(groupIds);
                    setGroupInfo(tmpGroupInfo);
                };
                getGroupInfo();
            }
            setTaskNumbers(arr);
        }
    }, [tasks, taskNumbers]);

    /**
     * Change selection type
     *
     * @param {string} type Type
     */
    const handleChangeType = (type) => {
        const groupSizes = {};
        if (type === 'GROUP') {
            Object.keys(groups).forEach((groupId) => {
                groupSizes[groupId] = [0, 0, 0];
            });
        }
        onChangeType(type, groupSizes);
    };

    /**
     * Render inputs
     *
     * @returns JSX
     */
    const renderInputs = () => {
        if (formValues.selectionType === 'DIFFICULTY' || (groups && Object.keys(groups).length < 2)) {
            return (
                <>
                    <h2 className="mt-2 mb-10">{language.dictionary.headerSelectByDifficulty}</h2>
                    <LevelSelect
                        levels={[0, 1, 2]}
                        levelSizes={taskNumbers}
                        values={formValues.size}
                        onChange={(arr) => onChangeSize(arr)}
                    />
                </>
            );
        }
        if (formValues.selectionType === 'GROUP') {
            return (
                <GroupSelection
                    groups={groups}
                    groupInfo={groupInfo}
                    sizes={formValues.groupSizes}
                    weights={formValues.weights}
                    onChange={(id, val) => onChangeGroupSize(id, val)}
                    onChangeWeight={(groupId, weight) => onChangeWeight(groupId, weight)}
                />
            );
        }
        return null;
    };

    return (
        <>
            <div className="flex">
                <h2 className="mt-4 mb-8">{`${language.dictionary.headerStep4}: ${language.dictionary.headerQuizSize}`}</h2>
                <span className="mt-2">
                    <InfoPopover content={language.dictionary.sizeDesc} />
                </span>
            </div>
            <hr className="mb-6" />
            {groups && Object.keys(groups).length > 1 && (
                <TypeSelect
                    type={formValues.selectionType}
                    types={types}
                    label={language.dictionary.labelSelectBy}
                    required
                    onChange={(e) => handleChangeType(e.target.value)}
                />
            )}
            <div className="my-8">
                {renderInputs()}
            </div>
        </>
    );
};

export default SizeSelection;
