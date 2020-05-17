import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import ConfirmOrDisagree from "./ConfirmOrDisagree";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { firestore } from "../firebase";
import Typography from "@material-ui/core/Typography";
import CreateItem from "./CreateItem";
import CreateNote from "./CreateNote";

const ConfirmComing = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [guests, setGuests] = useState([]);
    const { user } = props;

    useEffect(() => {
        document.title = "Ilmoittautuminen";

        if (user.uid) {
            firestore
                .collection("guests")
                .where("account", "==", user.uid)
                .get()
                .then((querySnapshot) => {
                    const arr = [];
                    querySnapshot.forEach((doc) => {
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
                    modifyGuest(i, { isComing });
                    const statusMsg = isComing ? "osallistuvaksi" : "ei osallistuvaksi";
                    enqueueSnackbar(`${guest.name} ilmoitettu ${statusMsg}`, {
                        variant: isComing ? "success" : "info",
                    });
                })
                .catch((err) => console.log(err));
        } else {
            // No id, so create a new avec
            if (isComing) {
                const avec = {
                    ...guest,
                    createdAt: Date.now(),
                    confirmedAt: Date.now(),
                    isComing: isComing,
                    account: user.uid,
                };
                firestore
                    .collection("guests")
                    .add(avec)
                    .then((res) => {
                        modifyGuest(i, { isComing, id: res.id });
                        enqueueSnackbar(`${guest.name} ilmoitettu osallistuvaksi`, {
                            variant: isComing ? "success" : "info",
                        });
                    })
                    .catch((err) => console.log(err));
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

    const getLabelText = (guest) => {
        if (guest.isAvec) return "Seuralaisen " + guest.name + " status";
        if (guest.isFamilyMember) return guest.name + " status";
        return "Sinun statuksesi";
    };

    const getStatusText = (guest) => {
        const isComing = guest.isComing;
        if (isComing === null) return "Vahvistamatta";
        if (isComing) return "Tulossa";
        return "Ei tulossa";
    };

    const createAvec = (name) => {
        setGuests([
            ...guests,
            { name: name, isAvec: true, isFamilyMember: false, isComing: null },
        ]);
    };

    const userHasAvec = () => {
        return guests.filter((guest) => guest.isAvec).length !== 0;
    };

    if (!user.isAllowedToConfirm)
        return (
            <Typography variant="h6">Ilmoittautuminen on suljettu sinun osaltasi</Typography>
        );

    return (
        <div className={classes.root}>
            <Typography variant="h6">Häihin ilmoittautuminen</Typography>
            <Typography variant="body1">
                Ilmoittautuminen on nyt auki, ja ilmoittautumisstatusta voi muuttaa 30.6.2020
                asti. Ilmoittautumisstatuksen lisäksi pyydämme ilmoittamaan mahdollisen
                erityisruokavalion, juoma-, musiikkikappale- ja muut toiveet. Ilmoittamalla
                nämä tiedot voimme huomioida vieraamme parhaalla mahdollisella tavalla.
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
            {user.isAvecAllowed && !userHasAvec() && (
                <>
                    <Typography variant="subtitle2">
                        Voit halutessasi tuoda myös seuralaisen
                    </Typography>
                    <CreateItem label="Henkilön nimi" add={createAvec} />
                </>
            )}
            <Typography variant="subtitle2">
                Kirjoita alla olevaan kenttään mahdolliset erikoisruokavaliot
            </Typography>
            <CreateNote label="Erikoisruokavalio" collection="intolerances" maxLength={500} />
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 600,
        margin: "auto",
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(ConfirmComing);
