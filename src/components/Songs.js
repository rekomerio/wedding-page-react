import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setLoading } from "../redux/actions";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import RemoveIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";
import { formatDistance } from "date-fns";
import { fi } from "date-fns/locale";

const Songs = props => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        document.title = "Kappaleet";
        props.setLoading(true);

        firestore
            .collection("songs")
            .orderBy("createdAt")
            .get()
            .then(querySnapshot => {
                const arr = [];
                querySnapshot.forEach(doc => {
                    arr.push({ ...doc.data(), id: doc.id });
                });
                setSongs(arr);
            })
            .catch(err => console.error(err))
            .finally(() => props.setLoading(false));
    }, [props]);

    const deleteSong = id => () => {
        if (!window.confirm("Poista kappale " + id + "?")) return;

        firestore
            .collection("songs")
            .doc(id)
            .delete()
            .then(() => {
                console.log("deleted");
                setSongs(songs.filter(song => song.id !== id));
            })
            .catch(err => console.log(err.message));
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nro</TableCell>
                            <TableCell align="left">Käyttäjä</TableCell>
                            <TableCell align="left">Poista</TableCell>
                            <TableCell align="left">Nimi</TableCell>
                            <TableCell align="left">Artisti</TableCell>
                            <TableCell align="left">Id</TableCell>
                            <TableCell align="left">Luotu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {songs.map((song, i) => (
                            <TableRow key={song.id}>
                                <TableCell component="th" scope="row">
                                    {i + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Link
                                        style={{ color: "black" }}
                                        to={"/user/" + song.addedBy + "/edit"}
                                    >
                                        <Fab size="small" color="primary">
                                            <EditIcon />
                                        </Fab>
                                    </Link>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Fab
                                        size="small"
                                        color="secondary"
                                        onClick={deleteSong(song.id)}
                                    >
                                        <RemoveIcon />
                                    </Fab>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {song.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {song.artist}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {song.id.slice(0, 10) + "..."}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {formatDistance(song.createdAt, new Date(), {
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

export default connect(null, { setLoading })(Songs);
