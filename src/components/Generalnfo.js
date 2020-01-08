import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import { formatDistance } from "date-fns";
import { fi } from "date-fns/locale";
import { Link } from "react-router-dom";
import Blogs from "./Blogs";

const GeneralInfo = () => {
    const classes = useStyles();
    return (
        <Paper elevation={2} className={classes.root}>
            <div className={classes.content}>
                <Typography variant="h4">Nämä ovat häät</Typography>
                <Typography variant="h6">Tervetuloa jne</Typography>
            </div>
        </Paper>
    );
};

const useStyles = makeStyles(theme => ({
    root: { width: "100%", minHeight: 600 },
    content: { margin: theme.spacing(2) }
}));

export default GeneralInfo;
