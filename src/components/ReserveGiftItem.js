import React, { useState, useRef, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveIcon from "@material-ui/icons/Check";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";
import { functions } from "../firebase";
import { useSnackbar } from "notistack";

const ReserveGiftItem = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [isReserving, setIsReserving] = useState(false);
    const isMounted = useRef(true);
    const { gift } = props;

    useEffect(() => {
        return () => (isMounted.current = false);
    }, []);

    const reserveGift = (id) => () => {
        const reserve = functions.httpsCallable("reserveGift");

        setIsReserving(true);

        reserve({ giftId: id })
            .then((res) => {
                console.log(res);
                const { message } = res.data;
                if (message.toLowerCase() === "ok") {
                    enqueueSnackbar(`${gift.name} varattu sinulle`, {
                        variant: "success",
                    });
                } else {
                    enqueueSnackbar(message, {
                        variant: "info",
                    });
                }
            })
            .catch((err) => console.log(err))
            .finally(() => {
                if (isMounted.current) setIsReserving(false);
            });
    };

    const removeReservation = (id) => () => {
        const unReserve = functions.httpsCallable("removeGiftReservation");

        setIsReserving(true);

        unReserve({ giftId: id })
            .then((res) => {
                console.log(res);
                enqueueSnackbar(`${gift.name} varaus poistettu`, {
                    variant: "info",
                });
            })
            .catch((err) => console.log(err))
            .finally(() => {
                if (isMounted.current) setIsReserving(false);
            });
    };

    return (
        <Paper>
            <div className={classes.gift}>
                <div className={classes.text}>
                    {gift.reservedByUser && (
                        <Typography className={classes.reservedText} variant="subtitle2">
                            Olet varannut tämän lahjan
                        </Typography>
                    )}
                    <Typography variant="caption">Lahjan nimi</Typography>
                    <Typography variant="body1">{gift.name}</Typography>
                </div>
                <div>
                    {isReserving && (
                        <Typography className={classes.reservingText} variant="caption">
                            Vahvistetaan...
                        </Typography>
                    )}
                    <div className={classes.buttons}>
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
            </div>
        </Paper>
    );
};

const useStyles = makeStyles((theme) => ({
    gift: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(1),
    },
    buttons: {
        minWidth: 104,
        "& > *": {
            marginLeft: theme.spacing(1),
        },
    },
    reservingText: {
        marginLeft: 12,
    },
    reservedText: {
        color: theme.palette.primary.main,
    },
}));

export default ReserveGiftItem;
