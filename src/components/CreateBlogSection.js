import React from "react";
import TextField from "@material-ui/core/TextField";
import AddImage from "./AddImage";
import makeStyles from "@material-ui/core/styles/makeStyles";
import RemoveIcon from "@material-ui/icons/Remove";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";

const CreateBlogSection = props => {
    const classes = useStyles();

    const handleTextChange = e => {
        props.onChange({ ...props.value, text: e.target.value });
    };

    const handleImageChange = image => {
        props.onChange({ ...props.value, image: image });
    };

    return (
        <Paper elevation={2} className={classes.root}>
            <Fab
                className={classes.button}
                color="primary"
                size="small"
                aria-label="add"
                onClick={props.remove}
            >
                <RemoveIcon />
            </Fab>
            <div>
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
    button: {
        float: "right"
    },
    input: {
        display: "none"
    }
}));

export default CreateBlogSection;
