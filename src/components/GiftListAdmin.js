import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import RemoveIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import { firestore } from "../firebase";

const GiftListAdmin = () => {
    const classes = useStyles();
    const [gifts, setGifts] = useState([]);
    const [giftStates, setGiftStates] = useState({});

    useEffect(() => {
        const unsubscribe = firestore.collection("gifts").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const data = change.doc.data();
                if (change.type === "added") {
                    const id = change.doc.id;
                    setGiftStates((state) => ({
                        ...state,
                        [id]: { isEditing: false, name: data.name },
                    }));
                    setGifts((prev) => [
                        ...prev,
                        {
                            ...data,
                            id,
                        },
                    ]);
                }
                if (change.type === "modified") {
                    setGifts((prev) => {
                        return prev.map((gift) => {
                            if (gift.id === change.doc.id) {
                                gift = {
                                    ...data,
                                    id: change.doc.id,
                                };
                            }
                            return gift;
                        });
                    });
                }
                if (change.type === "removed") {
                    setGifts((prev) => {
                        return prev.filter((gift) => gift.id !== change.doc.id);
                    });
                }
            });
        });
        return unsubscribe;
    }, []);

    const deleteGift = (id) => () => {
        if (!window.confirm("Oletko varma, että haluat poistaa tämän lahjan?")) {
            return;
        }
        firestore
            .collection("gifts")
            .doc(id)
            .delete()
            .then(() => {
                console.log("deleted");
            })
            .catch((err) => console.log(err.message));
    };

    const updateGift = (id) => () => {
        firestore
            .collection("gifts")
            .doc(id)
            .update({ name: giftStates[id].name })
            .then(() => {
                console.log("updated");
            })
            .catch((err) => console.log(err.message))
            .finally(invertState(id)());
    };

    const invertState = (id) => () => {
        const invertedState = {
            [id]: { ...giftStates[id], isEditing: !giftStates[id].isEditing },
        };
        setGiftStates({ ...giftStates, ...invertedState });
    };

    const handleChange = (id) => (e) => {
        const updatedValue = { ...giftStates[id], name: e.target.value };
        setGiftStates({ ...giftStates, [id]: updatedValue });
    };

    return (
        <div className={classes.root}>
            {gifts.map((gift) => (
                <Paper key={gift.id}>
                    <div className={classes.gift}>
                        <div>
                            <Typography variant="caption">Lahjan nimi</Typography>
                            {giftStates[gift.id].isEditing ? (
                                <TextField
                                    value={giftStates[gift.id].name}
                                    onChange={handleChange(gift.id)}
                                    type="text"
                                    fullWidth
                                />
                            ) : (
                                <Typography variant="body1">{gift.name}</Typography>
                            )}
                            {Boolean(gift.reservedBy) && (
                                <Typography variant="subtitle2">Varattu</Typography>
                            )}
                        </div>
                        <div className={classes.buttons}>
                            {giftStates[gift.id].isEditing ? (
                                <>
                                    <Tooltip title={"Hylkää muutokset"}>
                                        <Fab
                                            size="small"
                                            color="primary"
                                            onClick={invertState(gift.id)}
                                        >
                                            <ClearIcon />
                                        </Fab>
                                    </Tooltip>
                                    <Tooltip title={"Tallenna muutokset"}>
                                        <Fab
                                            size="small"
                                            color="secondary"
                                            onClick={updateGift(gift.id)}
                                        >
                                            <DoneIcon />
                                        </Fab>
                                    </Tooltip>
                                </>
                            ) : (
                                <>
                                    <Tooltip title={"Muokkaa " + gift.name}>
                                        <Fab
                                            size="small"
                                            color="secondary"
                                            onClick={invertState(gift.id)}
                                        >
                                            <EditIcon />
                                        </Fab>
                                    </Tooltip>
                                    <Tooltip title={"Poista " + gift.name}>
                                        <Fab
                                            size="small"
                                            color="primary"
                                            onClick={deleteGift(gift.id)}
                                        >
                                            <RemoveIcon />
                                        </Fab>
                                    </Tooltip>
                                </>
                            )}
                        </div>
                    </div>
                </Paper>
            ))}
            <div></div>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        "& > *": {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(0),
        },
    },
    gift: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(1),
    },
    buttons: {
        "& > *": {
            marginLeft: theme.spacing(1),
        },
    },
}));

export default GiftListAdmin;
