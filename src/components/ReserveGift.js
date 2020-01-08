import React, { useState, useEffect, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import firebase from "../firebase";
import ReserveGiftItem from "./ReserveGiftItem";

const ReserveGift = props => {
    const classes = useStyles();
    const [gifts, setGifts] = useState([]);
    const loading = useRef(false);
    const { user } = props;

    useEffect(() => {
        document.title = "Lahjan varaus";
        const db = firebase.firestore();
        if (!user || loading.current) {
            return;
        }

        loading.current = true;

        db.collection("gifts").onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const data = change.doc.data();
                if (change.type === "added") {
                    setGifts(prev => {
                        return [
                            ...prev,
                            {
                                ...data,
                                id: change.doc.id,
                                reservedByUser: user.uid === data.reservedBy
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
                                    id: change.doc.id,
                                    reservedByUser: user.uid === data.reservedBy
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
    }, [user]);

    return (
        <div className={classes.root}>
            {gifts.map(gift => (
                <ReserveGiftItem gift={gift} key={gift.id} />
            ))}
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: 600,
        margin: "auto",
        "& > *": {
            margin: theme.spacing(1)
        }
    }
}));

export default ReserveGift;
