import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';
/* Importing unstable_ to get rid of findDOMNode warnings in strict mode.
 * Should be fixed in material-ui v5.
 */

/**
 * Create Material UI theme
 */
const materialTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#3079B6',
        },
        secondary: {
            main: '#F0A00C',
        },
    },
    overrides: {
        MuiButton: {
            contained: {
                textTransform: 'inherit',
            },
            containedSizeSmall: {
                padding: '0.5rem',
                fontSize: '1rem',
            },
            containedSizeLarge: {
                padding: '0.75rem',
            },
            text: {
                textTransform: 'inherit',
                color: '#3079B6',
                fontSize: '1rem',
            },
            textSizeSmall: {
                justifyContent: 'left',
                width: '100%',
                paddingLeft: '1rem',
            },
        },
    },
});

export default materialTheme;
