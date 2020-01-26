import React from "react";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";

const NotFound = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div>
                <Typography variant="h1">404</Typography>
                <Typography variant="subtitle2">
                    "{window.location.href}" on reitti jota ei ole olemassa
                </Typography>
                <Link to="/" style={{ color: "#000" }}>
                    <Typography variant="h6">Takaisin etusivulle</Typography>
                </Link>
            </div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: "100vw",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around"
    },
    content: { margin: theme.spacing(2), textAlign: "center" },
    logo: {
        width: "70%",
        maxWidth: 360,
        margin: theme.spacing(-4),
        marginTop: theme.spacing(1)
    }
}));

export default NotFound;
