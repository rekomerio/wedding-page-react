import React, { useState, useEffect } from "react";
import CreateBlogSection from "./CreateBlogSection";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";
import Blog from "./Blog";
import Button from "@material-ui/core/Button";
import firebase from "../firebase";
import fileUpload from "../fileUpload";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

const CreateBlog = () => {
    const classes = useStyles();
    const db = firebase.firestore();
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState("");
    const emptyData = {
        text: "",
        image: { file: null, isUploaded: false, url: "", text: "" }
    };
    const [sections, setSections] = useState([emptyData]);

    useEffect(() => {
        document.title = "Blogin luonti";
    }, []);

    useEffect(() => {
        if (isUploading) {
            const imagesToUpload = sections.filter(section => section.image.file);
            const uploaded = imagesToUpload.filter(section => section.image.isUploaded);
            if (title && imagesToUpload.length === uploaded.length) {
                submitPost();
            }
        }
    }, [sections, isUploading]);

    const changeTitle = e => {
        setTitle(e.target.value);
    };

    const editSection = index => value => {
        const arr = [...sections];
        arr[index] = value;

        setSections(arr);
    };

    const addSection = () => {
        setSections([...sections, emptyData]);
    };

    const removeSection = index => () => {
        const arr = sections.filter((section, i) => index !== i);
        setSections(arr);
    };

    const setImageUrl = (index, img) => {
        const arr = sections.map((section, i) => {
            if (i === index) {
                section.image.url = img.url;
                section.image.path = img.fullPath;
                section.image.isUploaded = true;
                section.image.file = null;
            }
            return section;
        });

        setSections(arr);
    };

    const sendImages = () => {
        setIsUploading(true);
        sections.forEach((section, i) => {
            if (section.image.file) {
                fileUpload(section.image.file, "images", Date.now())
                    .then(image => {
                        console.log(image);
                        setImageUrl(i, image);
                    })
                    .catch(err => console.error(err));
            }
        });
    };

    const submitPost = () => {
        const post = {
            title: title,
            sections: sections.map(section => ({
                text: section.text,
                image: {
                    url: section.image.url || null,
                    path: section.image.path || null,
                    text: section.image.text || null
                }
            })),
            createdAt: Date.now()
        };

        db.collection("blogs")
            .add(post)
            .then(docRef => {
                console.log("Document written with ID:", docRef.id);
                setTitle("");
                setSections([emptyData]);
            })
            .catch(error => {
                console.error("Error adding document: ", error);
            })
            .finally(() => setIsUploading(false));
    };

    return (
        <React.Fragment>
            {isUploading ? <LinearProgress variant="query" color="primary" /> : null}
            <div className={classes.root}>
                <div className={classes.flexContainer}>
                    <div className={classes.create}>
                        <Typography variant="h6">Luo uusi postaus</Typography>
                        <TextField
                            name="title"
                            label="Blogin otsikko"
                            value={title}
                            onChange={changeTitle}
                            fullWidth
                        />
                        {sections.map((section, i) => (
                            <div key={i} className={classes.createSection}>
                                <CreateBlogSection
                                    index={i}
                                    value={section}
                                    onChange={editSection(i)}
                                    remove={removeSection(i)}
                                />
                            </div>
                        ))}
                        <Fab
                            color="primary"
                            size="small"
                            aria-label="add"
                            onClick={addSection}
                        >
                            <AddIcon />
                        </Fab>
                    </div>
                    <div className={classes.preview}>
                        <Typography variant="h4">Esikatselu</Typography>
                        <Blog title={title} sections={sections.slice()} />
                    </div>
                </div>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={isUploading}
                    onClick={sendImages}
                >
                    {isUploading ? "Lähetetään kuvia..." : "Lähetä"}
                </Button>
            </div>
        </React.Fragment>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        "& > *": {
            margin: theme.spacing(2)
        }
    },
    flexContainer: {
        display: "flex",
        justifyContent: "space-between"
    },
    create: {
        width: "40vw",
        margin: theme.spacing(1)
    },
    createSection: {
        margin: theme.spacing(1)
    },
    preview: {
        width: "60vw",
        marginTop: 46
    }
}));

export default CreateBlog;
