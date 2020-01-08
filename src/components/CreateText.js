import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const CreateText = props => {
    const [input, setInput] = useState("");

    const handleChange = e => {
        setInput(e.target.value);
    };

    const handleAdd = () => {
        props.onAdd(input);
        setInput("");
    };

    return (
        <div>
            <TextField
                id="standard-basic"
                onChange={handleChange}
                value={input}
                multiline
                label="Standard"
            />
            <Fab color="primary" size="small" aria-label="add" onClick={handleAdd}>
                <AddIcon />
            </Fab>
        </div>
    );
};

export default CreateText;
