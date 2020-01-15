import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Blogs from "./Blogs";
import GeneralInfo from "./Generalnfo";
import Map from "./Map";

const Homepage = () => {
    const classes = useStyles();

    useEffect(() => {
        document.title = "Etusivu";
    }, []);

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
        width: "100%",
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
        height: 600,
        margin: theme.spacing(2),
        ["@media (max-width:800px)"]: {
            height: 1200,
            flexDirection: "column",
            "& > *": {
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(1)
            }
        },
        "& > *": {
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1)
        }
    }
}));

export default Homepage;
