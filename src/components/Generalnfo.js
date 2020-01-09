import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";

const GeneralInfo = () => {
    const classes = useStyles();
    return (
        <Paper elevation={2} className={classes.root}>
            <div className={classes.content}>
                <Typography variant="h4">Info</Typography>
                <Typography variant="h6">Tapahtuma on....</Typography>
                <Typography variant="subtitle2">Ajankohta: </Typography>
                <Typography variant="subtitle2">Osoite: </Typography>
                <Typography variant="body1">
                    Tapahtumaan ilmoittautumisen voi suorittaa täällä. Ilmoittautumista voi
                    muuttaa vielä jälkikäteen, mutta huomioithan, että ilmoittautuminen
                    sulkeutuu viimeistään xx.xx...
                </Typography>
                <Typography variant="body1">
                    Helpottaaksemme lahjan hankkimista, olemme tehneet lahjalistan, josta voit
                    käydä katsomassa lahjaideoita ja varaamaassa ehdotuksen itsellesi. Lahjan
                    varaaminen ei ole sitova ja tapahtuu täysin anonyymisti. Jos et ole
                    kuitenkaan varma että olet hankkimassa valitsemasi lahjan, poistathan
                    varauksesi, jotta annat mahdollisuuden lahjan varaukseen muille
                    osallistujille.
                </Typography>
            </div>
        </Paper>
    );
};

const useStyles = makeStyles(theme => ({
    root: { width: "100%", height: "100%" },
    content: { margin: theme.spacing(2) }
}));

export default GeneralInfo;
