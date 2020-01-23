import React, { useState, useRef, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";

const CreateSongWish = props => {
    const classes = useStyles();
    const [input, setInput] = useState({ name: "", artist: "" });
    const [rotation, setRotation] = useState(0);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => (isMounted.current = false);
    }, []);

    const incrementAngle = 90;
    const transitionDuration = 350;
    const disabled = props.disabled || !Boolean(input.name);

    const handleChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const addItem = () => {
        props.onAdd && props.onAdd(input);
        setInput({ name: "", artist: "" });
        setRotation(deg => deg + incrementAngle);
        setTimeout(() => (isMounted.current ? setRotation(0) : null), transitionDuration); // Prevent state update on umounted component
    };

    const handleKeyDown = e => {
        if (e.key === "Enter") {
            !disabled && addItem();
        }
    };

    return (
        <div className={classes.root}>
            <TextField
                label="Kappaleen nimi"
                value={input.name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="name"
                type="text"
                fullWidth
                required
            />
            <TextField
                label="Kappaleen esittäjä"
                value={input.artist}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                name="artist"
                type="text"
                fullWidth
            />
            <span>
                <Fab
                    className={classes.rotate}
                    style={{
                        transition:
                            rotation === 0 ? "none" : `transform ${transitionDuration}ms`,
                        transform: `rotate(${rotation}deg)`
                    }}
                    color="primary"
                    aria-label="add"
                    size="small"
                    onClick={addItem}
                    disabled={disabled}
                >
                    <AddIcon />
                </Fab>
            </span>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "& > *": {
            margin: theme.spacing(1)
        }
    }
}));

export default CreateSongWish;
