import React from 'react';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import Button from '@material-ui/core/Button';

/**
 * Render back button
 */
const BackButton = ({
    label, disabled, color, onClick,
}) => (
    <span className="block">
        <Button
            variant="text"
            color={color || 'primary'}
            startIcon={<NavigateBefore />}
            size="large"
            type="button"
            onClick={() => onClick()}
            disabled={disabled}
        >
            {label}
        </Button>
    </span>
);

export default BackButton;
