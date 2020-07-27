import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/AddAPhoto";
import RemoveIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { storage } from "../firebase";
import fileUpload from "../fileUpload";

const AddImage = (props) => {
    const classes = useStyles();
    const [isUploading, setIsUploading] = useState(false);
    const onUpload = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();

            const file = event.target.files[0];

            reader.onload = (e) => {
                handleImageChange({ file: file, url: e.target.result });
            };

            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (!isUploading && props.image.startUpload && props.image.file) {
            setIsUploading(true);
            uploadImage();
        }
    }, [props]);

    const handleImageChange = (img) => {
        // If image has a path, delete from storage
        if (props.image.path) {
            deleteImage();
        }
        props.onChange({
            ...props.image,
            file: img.file,
            url: img.url,
            path: "",
            isUploaded: false,
            isUploading: false,
        });
    };

    const handleTextChange = (e) => {
        props.onChange({ ...props.image, text: e.target.value });
    };

    const deleteImage = () => {
        // Delete from storage
        const path = props.image.path;
        if (path) {
            const storageRef = storage.ref();
            storageRef
                .child(path)
                .delete()
                .then(() => {
                    console.log("deleted", path);
                })
                .catch((err) => console.log(err.message));
        }
        props.onChange({
            ...props.image,
            file: null,
            path: "",
            url: "",
        });
    };

    const uploadImage = () => {
        console.log("uploading image...");
        props.onChange({ ...props.image, startUpload: false, isUploading: true });
        fileUpload(props.image.file, "images", Date.now())
            .then((image) => {
                props.onChange({
                    ...props.image,
                    file: null,
                    isUploaded: true,
                    isUploading: false,
                    path: image.fullPath,
                    url: image.url,
                });
                console.log("upload done:", props.index);
            })
            .catch((err) => console.error(err))
            .finally(() => setIsUploading(false));
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

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    image: {
        width: "100%",
    },
    input: {
        display: "none",
    },
}));
