import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import RemoveIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import firebase from "../firebase";
import fileUpload from "../fileUpload";

const AddImage = props => {
    const classes = useStyles();
    const onUpload = event => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();

            const file = event.target.files[0];

            reader.onload = e => {
                handleImageChange({ file: file, url: e.target.result });
            };

            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (props.image.startUpload && props.image.file) {
            uploadImage();
        }
    }, [props]);

    const handleImageChange = img => {
        props.onChange({
            ...props.image,
            file: img.file,
            url: img.url
        });
    };

    const handleTextChange = e => {
        props.onChange({ ...props.image, text: e.target.value });
    };

    const deleteImage = () => {
        // Delete from storage
        if (props.image.path) {
            const storage = firebase.storage();
            const storageRef = storage.ref();
            storageRef
                .child(props.image.path)
                .delete()
                .then(() => console.log("deleted", props.image.path))
                .catch(err => console.log(err.message));
        }
        props.onChange({ ...props.image, file: null, url: "", text: "", isUploaded: false });
    };

    const uploadImage = () => {
        console.log("uploading image...");
        props.onChange({ ...props.image, startUpload: false, isUploading: true });
        fileUpload(props.image.file, "images", Date.now())
            .then(image => {
                console.log(image);
                props.onChange({
                    ...props.image,
                    file: null,
                    isUploaded: true,
                    isUploading: false,
                    path: image.fullPath,
                    url: image.url
                });
            })
            .catch(err => console.error(err));
    };

    return (
        <div className={classes.root}>
            <img className={classes.image} src={props.image.url} alt={props.image.text} />
            {props.image.url ? (
                <TextField
                    id="standard-basic"
                    onChange={handleTextChange}
                    value={props.image.text}
                    label="Kuvan otsikko"
                    fullWidth
                />
            ) : null}
            {props.image.isUploading ? <LinearProgress variant="query" /> : null}
            <input
                accept="image/*"
                className={classes.input}
                id={"icon-button-file-" + props.index}
                type="file"
                onChange={onUpload}
            />
            <label htmlFor={"icon-button-file-" + props.index}>
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                </IconButton>
            </label>
            <IconButton
                color="primary"
                aria-label="delete picture"
                component="span"
                disabled={!Boolean(props.image.url)}
                onClick={deleteImage}
            >
                <RemoveIcon />
            </IconButton>

            <Typography variant="caption">
                {props.image.isUploaded ? "Uploaded" : ""}
            </Typography>
        </div>
    );
};

export default AddImage;

const useStyles = makeStyles(theme => ({
    root: {
        "& > *": {
            margin: theme.spacing(1)
        }
    },
    image: {
        width: "100%"
    },
    input: {
        display: "none"
    }
}));
