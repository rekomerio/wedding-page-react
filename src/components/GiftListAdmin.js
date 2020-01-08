import React, { useState, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import RemoveIcon from "@material-ui/icons/Delete";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";
import firebase from "../firebase";

const GiftListAdmin = () => {
    const classes = useStyles();
    const [gifts, setGifts] = useState([]);
    const [users, setUsers] = useState([]);
    const unsubscribe = useRef(null);
    const loading = useRef(false);
    const db = useRef(firebase.firestore());

    useEffect(() => {
        if (loading.current) {
            return;
        }

        loading.current = true;

        unsubscribe.current = db.current.collection("gifts").onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const data = change.doc.data();
                if (change.type === "added") {
                    setGifts(prev => {
                        return [
                            ...prev,
                            {
                                ...data,
                                id: change.doc.id
                            }
                        ];
                    });
                }

                if (change.type === "modified") {
                    setGifts(prev => {
                        return prev.map(gift => {
                            if (gift.id === change.doc.id) {
                                gift = {
                                    ...data,
                                    id: change.doc.id
                                };
                            }
                            return gift;
                        });
                    });
                }
                if (change.type === "removed") {
                    setGifts(prev => {
                        return prev.filter(gift => gift.id !== change.doc.id);
                    });
                }
            });
        });

        db.current
            .collection("users")
            .get()
            .then(querySnapshot => {
                const arr = [];
                querySnapshot.forEach(doc => {
                    arr.push({ ...doc.data(), id: doc.id });
                });
                setUsers(arr);
            });
        return unsubscribe.current;
    }, []);

    const deleteGift = id => () => {
        if (!window.confirm("Oletko varma, että haluat poistaa tämän lahjan?")) {
            return;
        }
        db.current
            .collection("gifts")
            .doc(id)
            .delete()
            .then(() => {
                console.log("deleted");
            })
            .catch(err => console.log(err.message));
    };

    const getUserEmail = id => {
        const user = users.find(user => user.id === id);
        if (user) return user.email;
        return null;
    };

    return (
        <div className={classes.root}>
            {gifts.map((gift, i) => (
                <Paper key={i}>
                    <div className={classes.gift}>
                        <div>
                            <Typography variant="caption">Lahjan nimi</Typography>
                            <Typography variant="body1">{gift.name}</Typography>
                            {Boolean(gift.reservedBy) ? (
                                <Typography variant="subtitle2">Varattu</Typography>
                            ) : null}
                        </div>
                        <div className={classes.buttons}>
                            <Tooltip title={"Poista " + gift.name}>
                                <Fab
                                    size="small"
                                    color="secondary"
                                    onClick={deleteGift(gift.id)}
                                >
                                    <RemoveIcon />
                                </Fab>
                            </Tooltip>
                        </div>
                    </div>
                </Paper>
            ))}
            <div></div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        "& > *": {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(0)
        }
    },
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
    }
}));

export default GiftListAdmin;
