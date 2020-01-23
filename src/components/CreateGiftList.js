import React, { useState, useRef, useEffect } from "react";
import CreateItem from "./CreateItem";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveIcon from "@material-ui/icons/Check";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";
import { firestore } from "../firebase";
import GiftListAdmin from "./GiftListAdmin";

const CreateGiftList = () => {
    const classes = useStyles();
    const [gifts, setGifts] = useState([]);

    useEffect(() => {
        document.title = "Lahjalistan muokkaus";
    }, []);

    const addGift = gift => {
        setGifts([...gifts, gift]);
    };

    const deleteGift = index => () => {
        setGifts(gifts.filter((gift, i) => i !== index));
    };

    const saveGift = index => () => {
        firestore
            .collection("gifts")
            .add({
                name: gifts[index],
                reservedBy: "",
                createdAt: Date.now()
            })
            .then(() => {
                deleteGift(index)();
                console.log("success");
            })
            .catch(err => console.log(err.message));
    };

    return (
        <div>
            <div className={classes.root}>
                <GiftListAdmin />

                <CreateItem label="Uusi lahja" add={addGift} />
                {gifts.map((gift, i) => (
                    <Paper key={i}>
                        <div className={classes.gift}>
                            <div>
                                <Typography variant="caption">Lahjan nimi</Typography>
                                <Typography variant="body1">{gift}</Typography>
                            </div>
                            <div className={classes.buttons}>
                                <Tooltip title={"Tallenna " + gift}>
                                    <Fab size="small" color="primary" onClick={saveGift(i)}>
                                        <SaveIcon />
                                    </Fab>
                                </Tooltip>
                                <Tooltip title={"Poista " + gift}>
                                    <Fab
                                        size="small"
                                        color="secondary"
                                        onClick={deleteGift(i)}
                                    >
                                        <RemoveIcon />
                                    </Fab>
                                </Tooltip>
                            </div>
                        </div>
                    </Paper>
                ))}
            </div>
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

export default CreateGiftList;
