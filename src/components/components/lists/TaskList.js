import React, { useContext, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import LanguageContext from '../../../context/LanguageContext';
import TaskDialog from '../dialogs/TaskDialog';

/**
 * Render task list
 */
const TaskList = ({
    tasks, selectable, clickable, editable, disableSlider, showScore,
    onClickListItem, onChangeSlider, onChangeIndex,
}) => {
    const { language } = useContext(LanguageContext);
    const [openTask, setOpenTask] = useState(undefined);

    /**
     * Render difficulty slider input
     *
     * @returns JSX
     */
    const renderDiffSlider = (task) => (
        <div className="w-20 text-center">
            <Typography id="difficulty-slider" gutterBottom>
                {language.dictionary.labelLevel}
            </Typography>
            <Slider
                color="primary"
                value={task.difficulty}
                aria-labelledby="difficulty-slider"
                valueLabelDisplay="off"
                step={1}
                min={1}
                max={3}
                marks
                onChange={(e, val) => onChangeSlider(val, task)}
                disabled={disableSlider}
            />
        </div>
    );

    /**
     * Render list item action
     *
     * @param {Object} task Task object
     * @returns JSX
     */
    const renderAction = (task) => {
        if (selectable) {
            return (
                <Checkbox
                    edge="start"
                    checked={task.selected || false}
                    inputProps={{ 'aria-labelledby': task.id }}
                    onChange={() => onClickListItem(task)}
                />
            );
        }
        if (showScore) {
            if (task.score === null) return null;
            return <p>{`${language.dictionary.headerScore} ${task.score}`}</p>;
        }
        return renderDiffSlider(task);
    };

    /**
     * Render arrow buttons to move task up and down in list
     *
     * @param {int} index Task index
     * @returns JSX
     */
    const renderArrows = (index) => (
        <div className="mr-8 mt-4">
            <span className="mx-4">
                <IconButton
                    edge="end"
                    aria-label="minus"
                    color="primary"
                    onClick={() => onChangeIndex(index, index + 1)}
                    disabled={index === tasks.length - 1}
                >
                    <KeyboardArrowDown />
                </IconButton>
            </span>
            <IconButton
                edge="end"
                aria-label="plus"
                color="primary"
                onClick={() => onChangeIndex(index, index - 1)}
                disabled={index === 0}
            >
                <KeyboardArrowUp />
            </IconButton>
        </div>
    );

    return (
        <div className="overflow-y-auto px-2">
            <List>
                {tasks.map((task, index) => (
                    <ListItem
                        key={task.id}
                        className={`rounded bg-gray-100 h-24 mb-2 shadow-md ${(selectable || clickable) && 'cursor-pointer hover:bg-blue-100'}`}
                        onClick={() => { if (selectable || clickable) onClickListItem(task); }}
                    >
                        <ListItemIcon>
                            <IconButton
                                edge="end"
                                aria-label="info"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenTask(task);
                                }}
                            >
                                <InfoOutlined />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText
                            primary={(
                                <span className="block w-full px-1 lg:px-3">
                                    {task.title}
                                </span>
                            )}
                        />
                        <ListItemSecondaryAction>
                            <div className="flex">
                                {editable && renderArrows(index)}
                                {renderAction(task)}
                            </div>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            {openTask && (
                <TaskDialog
                    task={openTask}
                    onClose={() => setOpenTask(undefined)}
                />
            )}
        </div>
    );
};

export default TaskList;
