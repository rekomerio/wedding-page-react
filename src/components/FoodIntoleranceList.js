import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { connect } from "react-redux";
import { setLoading } from "../redux/actions";
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
import Dialog from "./Dialog";
import Typography from "@material-ui/core/Typography";

const FoodIntoleranceList = ({ setLoading }) => {
    const [intolerances, setIntolerances] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({});

    useEffect(() => {
        setLoading(true);

        firestore
            .collection("intolerances")
            .get()
            .then(querySnapshot => {
                const arr = [];
                querySnapshot.forEach(doc => {
                    arr.push({ ...doc.data(), id: doc.id });
                });
                setIntolerances(arr);
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    const openDialog = i => () => {
        const intolerance = intolerances[i];
        const render = intolerance.text.split("\n").map(text => (
            <Typography key={text} variant="body1">
                {text}
            </Typography>
        ));
        setDialogContent({ title: intolerance.id.slice(0, 20), render });
        setIsDialogOpen(true);
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nro</TableCell>
                            <TableCell align="left">Käyttäjä</TableCell>
                            <TableCell align="left">Teksti</TableCell>
                            <TableCell align="left">Id</TableCell>
                            <TableCell align="left">Luotu</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {intolerances.map((intolerance, i) => (
                            <TableRow key={intolerance.id}>
                                <TableCell component="th" scope="row">
                                    {i + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Link
                                        style={{ color: "black" }}
                                        to={"/user/" + intolerance.createdBy + "/edit"}
                                    >
                                        <Fab size="small" color="primary">
                                            <EditIcon />
                                        </Fab>
                                    </Link>
                                </TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={openDialog(i)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {intolerance.text.length > 20
                                        ? intolerance.text.slice(0, 20) + "..."
                                        : intolerance.text}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {intolerance.id.slice(0, 10) + "..."}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {formatDistance(intolerance.createdAt, new Date(), {
                                        locale: fi
                                    })}{" "}
                                    sitten
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog setOpen={setIsDialogOpen} open={isDialogOpen} title={dialogContent.title}>
                {dialogContent.render}
            </Dialog>
        </div>
    );
};

export default connect(null, { setLoading })(FoodIntoleranceList);
