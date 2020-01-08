import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";

const LoadingScreen = () => {
    const classes = useStyles();
    return <LinearProgress classes={{ root: classes.root }} variant="query" color="primary" />;
};

const useStyles = makeStyles(theme => ({
    root: {
        height: 6
    }
}));

export default LoadingScreen;
