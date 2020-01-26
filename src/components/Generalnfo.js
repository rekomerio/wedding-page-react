import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";

const GeneralInfo = () => {
    const classes = useStyles();
    return (
        <Paper elevation={2} className={classes.root}>
            <div className={classes.content}>
                <Typography variant="h4">Varaa päivä!</Typography>
                <img className={classes.logo} src="/images/logo.png" />
                <Typography variant="body1">
                    Loppukesä kruunataan tänä vuonna erityisen ihanalla tavalla!
                </Typography>
                <br />
                <Typography variant="body1">
                    Kutsumme teidät viettämään kanssamme rakkauden täyteistä hääjuhlaa
                    Jyväskylän Tikkalaan ja varaamaan kalenteristanne elokuun ensimmäisen
                    päivän.
                </Typography>
                <Typography variant="body1">Lisätietoa myöhemmin!</Typography>
                <br />
                <Typography variant="body1">Parhain terveisin Tuomas ja Vilma</Typography>
            </div>
        </Paper>
    );
};

const useStyles = makeStyles(theme => ({
    root: { width: "100%", height: "100%" },
    content: { margin: theme.spacing(2), textAlign: "center" },
    logo: {
        width: "70%",
        maxWidth: 360,
        margin: theme.spacing(-4),
        marginTop: theme.spacing(1)
    }
}));

export default GeneralInfo;
