import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ConfirmOrDisagree from "./ConfirmOrDisagree";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { firestore } from "../firebase";
import Typography from "@material-ui/core/Typography";
import CreateItem from "./CreateItem";

const ConfirmComing = props => {
    const classes = useStyles();
    const [guests, setGuests] = useState([]);
    const { user } = props;

    useEffect(() => {
        document.title = "Ilmoittautuminen";

        if (user.uid) {
            firestore
                .collection("guests")
                .where("account", "==", user.uid)
                .get()
                .then(querySnapshot => {
                    const arr = [];
                    querySnapshot.forEach(doc => {
                        arr.push({ ...doc.data(), id: doc.id });
                    });
                    setGuests(arr);
                });
        }
    }, [user]);

    const confirmGuest = (i, isComing) => () => {
        const guest = guests[i];
        // Guest has id so modify the guest
        if (guest.id) {
            firestore
                .collection("guests")
                .doc(guest.id)
                .set({ isComing: isComing, confirmedAt: Date.now() }, { merge: true })
                .then(() => {
                    console.log("confirmed");
                    modifyGuest(i, { isComing });
                })
                .catch(err => console.log(err));
        } else {
            // No id, so create a new avec
            if (isComing) {
                const avec = {
                    ...guest,
                    createdAt: Date.now(),
                    confirmedAt: Date.now(),
                    isComing: isComing,
                    account: user.uid
                };
                firestore
                    .collection("guests")
                    .add(avec)
                    .then(res => {
                        console.log("confirmed");
                        modifyGuest(i, { isComing, id: res.id });
                    })
                    .catch(err => console.log(err));
            } else {
                setGuests(guests.filter((guest, index) => index !== i));
            }
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

    if (!user.isAllowedToConfirm)
        return (
            <Typography variant="h6">Ilmoittautuminen on suljettu sinun osaltasi</Typography>
        );

    return (
        <div className={classes.root}>
            <Typography variant="h6">Häihin ilmoittautuminen</Typography>
            <Typography variant="body1">
                Tapahtumaan ilmoittautumisen voi suorittaa täällä. Ilmoittautumista voi muuttaa
                vielä jälkikäteen, mutta huomioithan, että ilmoittautuminen sulkeutuu
                viimeistään xx.xx...
            </Typography>

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

            {user.isAvecAllowed && !userHasAvec() ? (
                <>
                    <Typography variant="subtitle2">
                        Voit halutessasi tuoda myös seuralaisen
                    </Typography>
                    <CreateItem label="Henkilön nimi" add={createAvec} />
                </>
            ) : null}
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

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(ConfirmComing);
