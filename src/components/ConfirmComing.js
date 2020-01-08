import React, { useEffect, useState } from "react";
import ConfirmOrDisagree from "./ConfirmOrDisagree";
import makeStyles from "@material-ui/core/styles/makeStyles";
import firebase from "../firebase";
import Typography from "@material-ui/core/Typography";
import CreateItem from "./CreateItem";

const ConfirmComing = props => {
    const classes = useStyles();
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        document.title = "Ilmoittautuminen";

        if (props.user.uid) {
            const db = firebase.firestore();
            db.collection("guests")
                .where("account", "==", props.user.uid)
                .get()
                .then(querySnapshot => {
                    const arr = [];
                    querySnapshot.forEach(doc => {
                        arr.push({ ...doc.data(), id: doc.id });
                    });
                    setGuests(arr);
                });
        }
    }, []);

    const confirmGuest = (i, isComing) => () => {
        const db = firebase.firestore();
        const guest = guests[i];
        if (guest.id) {
            db.collection("guests")
                .doc(guest.id)
                .set({ isComing: isComing, confirmedAt: Date.now() }, { merge: true })
                .then(() => {
                    console.log("confirmed");
                    modifyGuest(i, { isComing });
                })
                .catch(err => console.log(err));
        } else {
            const avec = {
                ...guest,
                createdAt: Date.now(),
                confirmedAt: Date.now(),
                isComing: isComing,
                account: props.user.uid
            };
            db.collection("guests")
                .add(avec)
                .then(res => {
                    console.log("confirmed");
                    modifyGuest(i, { isComing, id: res.id });
                })
                .catch(err => console.log(err));
        }
    };

    const modifyGuest = (index, object) => {
        const arr = [...guests];
        arr[index] = Object.assign(arr[index], object);
        setGuests(arr);
    };
    const getLabelText = guest => {
        if (guest.isAvec) return "Seuralaisen " + guest.name + " status";
        if (guest.isFamilyMember) return guest.name + " status";
        return "Sinun statuksesi";
    };

    const getStatusText = guest => {
        const isComing = guest.isComing;
        if (isComing === null) return "Vahvistamatta";
        if (isComing) return "Tulossa";
        return "Ei tulossa";
    };

    const createAvec = name => {
        setGuests([
            ...guests,
            { name: name, isAvec: true, isFamilyMember: false, isComing: null }
        ]);
    };

    const userHasAvec = () => {
        return guests.filter(guest => guest.isAvec).length !== 0;
    };

    if (!props.user.isAllowedToConfirm)
        return (
            <Typography variant="h6">Ilmoittautuminen on suljettu sinun osaltasi</Typography>
        );

    return (
        <div className={classes.root}>
            <Typography variant="body1">Voit vaihtaa valintaasi vielä jälkikäteen</Typography>

            {guests.map((member, i) => (
                <ConfirmOrDisagree
                    key={i}
                    label={getLabelText(member)}
                    text={getStatusText(member)}
                    confirmText={member.name + " on tulossa"}
                    disagreeText={member.name + " ei ole tulossa"}
                    confirmDisabled={member.isComing}
                    disagreeDisabled={member.isComing === false}
                    onConfirm={confirmGuest(i, true)}
                    onDisagree={confirmGuest(i, false)}
                />
            ))}

            {props.user.isAvecAllowed && !userHasAvec() ? (
                <CreateItem label="Lisää seuralainen" add={createAvec} />
            ) : null}
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: 600,
        ["@media (max-width:600px)"]: {
            // eslint-disable-line no-useless-computed-key
            width: "100%"
        },
        margin: "auto",
        "& > *": {
            margin: theme.spacing(1)
        }
    }
}));
export default ConfirmComing;
