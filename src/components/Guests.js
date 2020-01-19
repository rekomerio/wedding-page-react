import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setLoading } from "../redux/actions";
import { firestore } from "../firebase";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import { formatDistance } from "date-fns";
import { fi } from "date-fns/locale";
import { Typography } from "@material-ui/core";

const Guests = props => {
    const classes = useStyles();
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        document.title = "Vieraat";
    }, []);

    useEffect(() => {
        const db = firestore;

        props.setLoading(true);
        db.collection("guests")
            .get()
            .then(querySnapshot => {
                const arr = [];
                querySnapshot.forEach(doc => {
                    arr.push({ ...doc.data(), id: doc.id });
                });
                arr.sort((a, b) => b.confirmedAt - a.confirmedAt);
                setGuests(arr);
            })
            .catch(err => console.error(err))
            .finally(() => props.setLoading(false));
    }, []);

    const guestCount = guests.length;
    const comingGuests = guests.filter(guest => guest.isComing).length;
    const notComingGuests = guests.filter(guest => guest.isComing === false).length;
    const unconfirmedGuests = guests.filter(guest => guest.isComing === null).length;

    return (
        <div>
            <Typography variant="h6">Kutsutuista henkilöistä</Typography>
            <Typography variant="subtitle2">
                Tulossa {comingGuests} / {guestCount}
            </Typography>
            <Typography variant="subtitle2">
                Ei tulossa {notComingGuests} / {guestCount}
            </Typography>
            <Typography variant="subtitle2">
                Vahvistamatta {unconfirmedGuests} / {guestCount}
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nro</TableCell>
                            <TableCell align="left">Muokkaus</TableCell>
                            <TableCell align="left">Id</TableCell>
                            <TableCell align="left">Nimi</TableCell>
                            <TableCell align="left">Tulossa</TableCell>
                            <TableCell align="left">Vieraan tyyppi</TableCell>
                            <TableCell align="left">Viimeisin ilmoittautuminen</TableCell>
                            <TableCell align="left">Luotu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {guests.map((guest, i) => (
                            <TableRow key={guest.id}>
                                <TableCell component="th" scope="row">
                                    {i + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Link
                                        style={{ color: "black" }}
                                        to={"/user/" + guest.account + "/edit"}
                                    >
                                        <Fab size="small" color="primary">
                                            <EditIcon />
                                        </Fab>
                                    </Link>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {guest.id.slice(0, 10) + "..."}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {guest.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {guest.isComing === null
                                        ? "Ei vahvistanut"
                                        : guest.isComing === true
                                        ? "Kyllä"
                                        : "Ei"}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {guest.isAvec
                                        ? "Avec"
                                        : guest.isFamilyMember
                                        ? "Perheenjäsen"
                                        : "Käyttäjä"}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {guest.confirmedAt
                                        ? formatDistance(guest.confirmedAt, new Date(), {
                                              locale: fi
                                          }) + " sitten"
                                        : "Vahvistamatta"}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {formatDistance(guest.createdAt, new Date(), {
                                        locale: fi
                                    })}{" "}
                                    sitten
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        margin: "auto",
        width: 800,
        "& > *": {
            margin: theme.spacing(2)
        }
    }
}));

export default connect(null, { setLoading })(Guests);
