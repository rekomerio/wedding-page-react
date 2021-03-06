import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { firestore } from "../firebase";

const CreateNote = (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { user, maxLength } = props;
    const [note, setNote] = useState({ text: "" });
    const [originalNote, setOriginalNote] = useState({ text: "" });
    const [shouldSave, setShouldSave] = useState(false);

    useEffect(() => {
        firestore
            .collection(props.collection)
            .where("createdBy", "==", user.uid)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setNote({ ...data, id: doc.id });
                    setOriginalNote({ ...data, id: doc.id });
                });
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        setShouldSave(originalNote.text !== note.text);
    }, [note, originalNote]);

    const handleChange = (e) => {
        if (e.target.value.length <= maxLength) setNote({ ...note, text: e.target.value });
    };

    const onClick = () => {
        if (!note.text && note.id) {
            deleteNote();
        } else if (note.id) {
            saveNote();
        } else {
            addNote();
        }
    };

    const addNote = () => {
        firestore
            .collection(props.collection)
            .add({ text: note.text, createdBy: user.uid, createdAt: Date.now() })
            .then((res) => {
                setNote((state) => ({ ...state, id: res.id }));
                setOriginalNote({ text: note.text });
                enqueueSnackbar(`${props.label} tallennettu`, {
                    variant: "info",
                });
            })
            .catch((err) => console.error(err.message));
    };

    const saveNote = () => {
        firestore
            .collection(props.collection)
            .doc(note.id)
            .set({ text: note.text }, { merge: true })
            .then(() => {
                setOriginalNote({ text: note.text });
                enqueueSnackbar(`${props.label} tallennettu`, {
                    variant: "info",
                });
            })
            .catch((err) => console.error(err.message));
    };

    const deleteNote = () => {
        firestore
            .collection(props.collection)
            .doc(note.id)
            .delete()
            .then(() => {
                setNote({ text: "", id: null });
                setOriginalNote({ text: "" });
                enqueueSnackbar(`${props.label} tallennettu`, {
                    variant: "info",
                });
            })
            .catch((err) => console.error(err.message));
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
                label={`${props.label} (${note.text.length}/${maxLength})`}
                multiline
                fullWidth
                value={note.text}
                onChange={handleChange}
            />
            <span>
                <Button
                    style={{ marginLeft: 8 }}
                    color="secondary"
                    variant="contained"
                    disabled={!shouldSave}
                    onClick={onClick}
                >
                    Tallenna
                </Button>
            </span>
        </div>
    );
};

CreateNote.defaultProps = {
    maxLength: 1000,
};

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(CreateNote);
