import React from 'react';
import Xarrow from 'react-xarrows';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ThumbnailImage from '../ThumbnailImage';

/**
 * Render arrow list for terms
 */
const ArrowList = ({
    taskId, options, relations, solution, selected, selectable, coloredArrows, onClickListItem,
}) => {
    /**
     * Render term list item
     *
     * @param {Object} term Term
     * @returns JSX
     */
    const renderListItem = (term) => {
        if (term.type === 'IMAGE') {
            return (
                <ThumbnailImage
                    mediaId={term.term}
                    alt="Task illustration"
                />
            );
        }
        return <div className="break-words">{term.term}</div>;
    };

    /**
     * Render arrow
     *
     * @param {Array} relation Term relation
     * @param {int} index Element index
     * @returns JSX
     */
    const renderArrow = (relation, index) => {
        let arrowColor = '#000000';
        if (coloredArrows) {
            const color = ['#001cad', '#457bf9', '#05cdff', '#6816ff', '#310e72', '#a777ff'];
            arrowColor = color.length > index ? color[index] : '#000000';
            if (solution) {
                let correct = false;
                if (solution.find((arr) => arr.every((el, i) => el === relation[i]))) {
                    correct = true;
                }
                arrowColor = correct ? '#059669' : '#DC2626';
            }
        }
        return (
            <Xarrow
                key={index}
                color={arrowColor}
                start={`task${taskId}rel${relation[0]}`}
                end={`task${taskId}rel${relation[1]}`}
                startAnchor="right"
                endAnchor="left"
                headSize={5}
            />
        );
    };

    return options && options.length === 2 && Array.isArray(options[0]) ? (
        <div className="overflow-y-auto flex">
            <List className="w-56">
                {options[0].map((term) => (
                    <ListItem
                        id={`task${taskId}rel${term.id}`}
                        key={term.id}
                        className="rounded mb-2 shadow-md h-56"
                        onClick={() => { if (selectable) onClickListItem(term.id, true); }}
                        button={selectable || false}
                    >
                        <ListItemText primary={renderListItem(term)} />
                    </ListItem>
                ))}
            </List>
            <span className="ml-8">
                <List className="w-56">
                    {options[1].map((term) => (
                        <ListItem
                            id={`task${taskId}rel${term.id}`}
                            key={term.id}
                            className="rounded mb-2 shadow-md h-56"
                            onClick={() => {
                                if (selectable && selected) onClickListItem(term.id, false);
                            }}
                            button={selectable || false}
                        >
                            <ListItemText primary={renderListItem(term)} />
                        </ListItem>
                    ))}
                </List>
            </span>
            {relations && relations.map((element, index) => renderArrow(element, index))}
        </div >
    ) : null;
};

export default ArrowList;
