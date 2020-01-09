import React, { useState, useEffect } from "react";
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

const Users = () => {
    const classes = useStyles();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        document.title = "Käyttäjät";
    }, []);

    useEffect(() => {
        const db = firestore;

        db.collection("users")
            .get()
            .then(querySnapshot => {
                const arr = [];
                querySnapshot.forEach(doc => {
                    arr.push({ ...doc.data(), id: doc.id });
                });
                setUsers(arr);
            });
    }, []);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nro</TableCell>
                            <TableCell align="left">Muokkaus</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Nimi</TableCell>
                            <TableCell align="left">Id</TableCell>
                            <TableCell align="left">Avec sallittu</TableCell>
                            <TableCell align="left">Perheenjäsenet sallittu</TableCell>
                            <TableCell align="left">Ilmoittautumisoikeus</TableCell>
                            <TableCell align="left">Admin</TableCell>
                            <TableCell align="left">Luotu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, i) => (
                            <TableRow key={user.id}>
                                <TableCell component="th" scope="row">
                                    {i + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Link
                                        style={{ color: "black" }}
                                        to={"/user/" + user.id + "/edit"}
                                    >
                                        <Fab size="small" color="primary">
                                            <EditIcon />
                                        </Fab>
                                    </Link>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.email}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.id.slice(0, 10) + "..."}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.isAvecAllowed ? "Kyllä" : "Ei"}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.isFamilyAllowed ? "Kyllä" : "Ei"}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.isAllowedToConfirm ? "Kyllä" : "Ei"}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.isAdmin ? "Kyllä" : "Ei"}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {formatDistance(user.createdAt, new Date(), {
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

export default Users;
