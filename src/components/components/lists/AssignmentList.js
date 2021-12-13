import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import formatDate from '../../../utils/format-date';

/**
 * Render assignment list
 */
const AssignmentList = ({ assignments, onClickListItem }) => (
    <div className="overflow-y-auto px-2 mt-4">
        <List>
            {assignments && assignments.map((assignment) => (
                <ListItem
                    key={assignment.id}
                    className="rounded bg-gray-100 h-24 mb-2 shadow-md cursor-pointer hover:bg-blue-100"
                    onClick={() => onClickListItem(assignment.id)}
                >
                    <ListItemIcon>
                        <span className="pr-4">
                            <span className="ml-4 mr-3">
                                <Checkbox
                                    edge="start"
                                    checked={assignment.selected || false}
                                    inputProps={{ 'aria-labelledby': assignment.id }}
                                />
                            </span>
                        </span>
                    </ListItemIcon>
                    <ListItemText
                        primary={assignment.title}
                        secondary={formatDate(assignment.created_at, true)}
                    />
                </ListItem>
            ))}
        </List>
    </div>
);

export default AssignmentList;
