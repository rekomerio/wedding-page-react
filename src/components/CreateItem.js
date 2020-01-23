import React, { useState, useRef, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";

const CreateItem = props => {
    const classes = useStyles();
    const [input, setInput] = useState("");
    const [rotation, setRotation] = useState(0);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => (isMounted.current = false);
    }, []);

    const incrementAngle = 90;
    const transitionDuration = 350;
    const disabled = props.disabled || !Boolean(input);

    const handleChange = e => {
        setInput(e.target.value);
    };

    const addItem = () => {
        props.add && props.add(input);
        setInput("");
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
            <div className={classes.flexContainer}>
                <TextField
                    label={props.label}
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    type="text"
                    fullWidth
                />
                <Tooltip title={"Lisää " + input}>
                    <span>
                        <Fab
                            className={classes.rotate}
                            style={{
                                transition:
                                    rotation === 0
                                        ? "none"
                                        : `transform ${transitionDuration}ms`,
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
                </Tooltip>
            </div>
            <div className={classes.child}>{props.children}</div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {},
    flexContainer: {
        display: "flex",
        alignItems: "center"
    },
    child: {},
    rotate: {}
}));

export default CreateItem;
