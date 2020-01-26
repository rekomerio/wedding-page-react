import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { firestore } from "../firebase";

const FoodIntoleranceList = () => {
    const classes = useStyles();
    const [intolerances, setIntolerances] = useState([]);

    useEffect(() => {
        firestore
            .collection("intolerances")
            .get()
            .then(querySnapshot => {
                const arr = [];
                querySnapshot.forEach(doc => {
                    arr.push({ ...doc.data(), id: doc.id });
                });
                setIntolerances(arr);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                {intolerances.map(intolerance => (
                    <Grid key={intolerance.id} item xs>
                        <Paper className={classes.paper}>
                            <Typography variant="subtitle2">
                                {intolerance.createdBy}
                            </Typography>
                            {intolerance.text.split("\n").map((text, i) => (
                                <Typography key={i} variant="body1">
                                    {text}
                                </Typography>
                            ))}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default FoodIntoleranceList;

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary
    }
}));
