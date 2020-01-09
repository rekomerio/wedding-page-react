import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveIcon from "@material-ui/icons/Check";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";
import { functions } from "../firebase";

const ReserveGiftItem = props => {
    const classes = useStyles();
    const [isReserving, setIsReserving] = useState(false);
    const { gift } = props;

    const reserveGift = id => () => {
        const reserve = functions.httpsCallable("reserveGift");

        setIsReserving(true);

        reserve({ giftId: id })
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .finally(() => setIsReserving(false));
    };

    const removeReservation = id => () => {
        const unReserve = functions.httpsCallable("removeGiftReservation");

        setIsReserving(true);

        unReserve({ giftId: id })
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .finally(() => setIsReserving(false));
    };

    return (
        <Paper>
            <div className={classes.gift}>
                <div>
                    {gift.reservedByUser ? (
                        <Typography className={classes.reservedText} variant="subtitle2">
                            Olet varannut tämän lahjan
                        </Typography>
                    ) : null}
                    <Typography variant="caption">Lahjan nimi</Typography>
                    <Typography variant="body1">{gift.name}</Typography>
                </div>
                <div className={classes.buttons}>
                    <Typography variant="caption">
                        {isReserving ? "Vahvistetaan, odota hetki..." : ""}
                    </Typography>
                    <Tooltip
                        title={
                            Boolean(gift.reservedBy)
                                ? "Tämä lahja on jo varattu"
                                : "Varaa lahja " + gift.name
                        }
                    >
                        <span>
                            <Fab
                                size="small"
                                color="secondary"
                                onClick={reserveGift(gift.id)}
                                disabled={isReserving || Boolean(gift.reservedBy)}
                            >
                                <SaveIcon />
                            </Fab>
                        </span>
                    </Tooltip>
                    <Tooltip
                        title={
                            gift.reservedByUser
                                ? "Poista varaus"
                                : "Et ole varannut tätä lahjaa"
                        }
                    >
                        <span>
                            <Fab
                                size="small"
                                color="primary"
                                onClick={removeReservation(gift.id)}
                                disabled={isReserving || !gift.reservedByUser}
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
    gift: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(1)
    },
    buttons: {
        "& > *": {
            marginLeft: theme.spacing(1)
        }
    },
    reservedText: {
        color: theme.palette.primary.main
    }
}));

export default ReserveGiftItem;
