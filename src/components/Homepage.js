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
import GeneralInfo from "./Generalnfo";
import Map from "./Map";

const Homepage = () => {
    const classes = useStyles();
    return (
        <div>
            <header className={classes.header}>
                <div>
                    <Typography variant="h2"></Typography>
                </div>
            </header>
            <div className={classes.flex}>
                <GeneralInfo />
                <Map />
            </div>
            <Blogs />
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        margin: "auto",
        width: 800,
        ["@media (max-width:800px)"]: {
            // eslint-disable-line no-useless-computed-key
            width: "100%"
        },
        "& > *": {
            margin: theme.spacing(0)
        }
    },
    header: {
        minHeight: "60vh",
        minWidth: "100vw",
        backgroundImage: "url(/images/header.jpg)",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "white"
    },
    flex: {
        display: "flex",
        ["@media (max-width:800px)"]: {
            flexDirection: "column"
        },
        "& > *": {
            margin: theme.spacing(2)
        }
    }
}));

export default Homepage;
