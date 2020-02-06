import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        minWidth: 350
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiDialogContent);

export default function CustomizedDialogs(props) {
    const classes = useStyles();
    const handleClose = () => {
        props.setOpen(false);
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
            classes={{ paper: classes.paper }}
        >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {props.title}
            </DialogTitle>
            <DialogContent dividers>{props.children}</DialogContent>
        </Dialog>
    );
}

const useStyles = makeStyles(theme => ({
    paper: {
        maxWidth: "90vw"
    }
}));
