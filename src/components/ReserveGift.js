import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { firestore } from "../firebase";
import ReserveGiftItem from "./ReserveGiftItem";
import Typography from "@material-ui/core/Typography";

const ReserveGift = props => {
    const classes = useStyles();
    const [gifts, setGifts] = useState([]);
    const { user } = props;

    useEffect(() => {
        document.title = "Lahjan varaus";
        if (!user) {
            return;
        }

        const unsubscribe = firestore.collection("gifts").onSnapshot(snapshot => {
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
        return unsubscribe;
    }, [user]);

    return (
        <div className={classes.root}>
            <Typography variant="h6">Lahjan varaus</Typography>
            <Typography variant="body1">
                Helpottaaksemme lahjan hankkimista, olemme tehneet lahjalistan, josta voit
                käydä katsomassa lahjaideoita ja varaamaassa ehdotuksen itsellesi. Lahjan
                varaaminen ei ole sitova ja tapahtuu täysin anonyymisti. Jos et ole kuitenkaan
                varma että olet hankkimassa valitsemasi lahjan, poistathan varauksesi, jotta
                annat mahdollisuuden lahjan varaukseen muille osallistujille.
            </Typography>
            {gifts.length ? (
                gifts.map(gift => <ReserveGiftItem gift={gift} key={gift.id} />)
            ) : (
                <Typography variant="h6">Lahjalista on tyhjä</Typography>
            )}
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 600,
        margin: "auto",
        "& > *": {
            margin: theme.spacing(1)
        }
    }
}));

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(ReserveGift);
