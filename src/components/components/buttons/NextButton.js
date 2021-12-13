import React from 'react';
import NavigateNext from '@material-ui/icons/NavigateNext';
import Button from '@material-ui/core/Button';

/**
 * Render next button
 */
const NextButton = ({ label, disabled, onClick }) => (
    <Button
        variant="text"
        color="primary"
        endIcon={<NavigateNext />}
        size="large"
        type="button"
        onClick={() => onClick()}
        disabled={disabled}
    >
        {label}
    </Button>
);

export default NextButton;
