import React from "react";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveIcon from "@material-ui/icons/Check";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";
import propTypes from "prop-types";

const ConfirmOrDisagree = props => {
    const classes = useStyles();
    const {
        onConfirm,
        onDisagree,
        disagreeText,
        confirmText,
        label,
        text,
        confirmDisabled,
        disagreeDisabled
    } = props;

    const confirm = () => {
        if (onConfirm) onConfirm();
    };

    const disagree = () => {
        if (onDisagree) onDisagree();
    };

    return (
        <Paper>
            <div className={classes.item}>
                <div>
                    <Typography variant="caption">{label}</Typography>
                    <Typography variant="body1">{text}</Typography>
                </div>
                <div className={classes.buttons}>
                    <Tooltip title={confirmText}>
                        <span>
                            <Fab
                                size="small"
                                color="secondary"
                                onClick={confirm}
                                disabled={confirmDisabled}
                            >
                                <SaveIcon />
                            </Fab>
                        </span>
                    </Tooltip>
                    <Tooltip title={disagreeText}>
                        <span>
                            <Fab
                                size="small"
                                color="primary"
                                onClick={disagree}
                                disabled={disagreeDisabled}
                            >
                                <RemoveIcon />
                            </Fab>
                        </span>
                    </Tooltip>
                </div>
            </div>
        </Paper>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: 700,
        margin: "auto",
        "& > *": {
            margin: theme.spacing(1)
        }
    },
    item: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(1)
    },
    buttons: {
        "& > *": {
            marginLeft: theme.spacing(1)
        }
    }
}));

ConfirmOrDisagree.propTypes = {
    onConfirm: propTypes.func,
    onDisagree: propTypes.func,
    disagreeText: propTypes.string,
    confirmText: propTypes.string,
    label: propTypes.string,
    text: propTypes.string,
    confirmDisabled: propTypes.bool,
    disagreeDisabled: propTypes.bool
};

ConfirmOrDisagree.defaultProps = {
    disagreeText: "Ei",
    confirmText: "Kyllä",
    label: "",
    text: "",
    confirmDisabled: false,
    disagreeDisabled: false
};

export default ConfirmOrDisagree;
