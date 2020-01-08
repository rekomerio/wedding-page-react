import React from "react";
import TextField from "@material-ui/core/TextField";
import AddImage from "./AddImage";
import makeStyles from "@material-ui/core/styles/makeStyles";
import RemoveIcon from "@material-ui/icons/Remove";
import DownIcon from "@material-ui/icons/ArrowDownward";
import UpIcon from "@material-ui/icons/ArrowUpward";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";

const CreateBlogSection = props => {
    const classes = useStyles();

    const handleTextChange = e => {
        props.onChange({ ...props.value, [e.target.name]: e.target.value });
    };

    const handleImageChange = image => {
        props.onChange({ ...props.value, image: image });
    };

    return (
        <Paper elevation={2} className={classes.root}>
            <div className={classes.buttons}>
                <div>
                    <Fab
                        color="secondary"
                        size="small"
                        aria-label="move-up"
                        onClick={props.moveUp}
                        disabled={!Boolean(props.moveUp)}
                    >
                        <UpIcon />
                    </Fab>
                    <Fab
                        color="secondary"
                        size="small"
                        aria-label="move-down"
                        onClick={props.moveDown}
                        disabled={!Boolean(props.moveDown)}
                    >
                        <DownIcon />
                    </Fab>
                </div>
                <Fab color="primary" size="small" aria-label="add" onClick={props.remove}>
                    <RemoveIcon />
                </Fab>
            </div>
            <div>
                <TextField
                    onChange={handleTextChange}
                    value={props.value.title}
                    name="title"
                    label="Osion otsikko"
                    fullWidth
                />
                <TextField
                    onChange={handleTextChange}
                    value={props.value.text}
                    name="text"
                    multiline
                    label="Teksti"
                    fullWidth
                />
                <AddImage
                    onChange={handleImageChange}
                    image={props.value.image}
                    index={props.index}
                />
            </div>
        </Paper>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    },
    buttons: {
        display: "flex",
        justifyContent: "space-between",
        "& > div": {
            "& > *": { margin: theme.spacing(0.5) }
        }
    },

    input: {
        display: "none"
    }
}));

export default CreateBlogSection;
