import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

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

    const handleImageChange = img => {
        props.onChange({ ...props.image, file: img.file, url: img.url });
    };

    const handleTextChange = e => {
        props.onChange({ ...props.image, text: e.target.value });
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
