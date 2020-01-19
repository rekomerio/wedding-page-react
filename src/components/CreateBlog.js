import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setLoading } from "../redux/actions";
import CreateBlogSection from "./CreateBlogSection";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";
import Blog from "./Blog";
import Button from "@material-ui/core/Button";
import { firestore } from "../firebase";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

const CreateBlog = props => {
    const classes = useStyles();
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState("");
    const [postId, setPostId] = useState("");
    const emptyData = {
        title: "",
        text: "",
        image: {
            file: null,
            isUploaded: false,
            isUploading: false,
            url: "",
            text: "",
            startUpload: false
        }
    };

    const [sections, setSections] = useState([emptyData]);

    useEffect(() => {
        document.title = "Blogin luonti";
    }, []);

    useEffect(() => {
        if (props.post) {
            setTitle(props.post.title);
            setSections(props.post.sections);
            setPostId(props.post.id);
        }
    }, [props.post]);

    useEffect(() => {
        props.setLoading(isUploading);
    }, [isUploading]);

    useEffect(() => {
        if (isUploading) {
            const imagesToUpload = sections.filter(section => section.image.file);
            const uploaded = imagesToUpload.filter(section => section.image.isUploaded);
            if (title && imagesToUpload.length === uploaded.length) {
                submitPost();
            }
        }
        console.log(sections);
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

    const moveSectionDown = index => () => {
        const arr = [...sections];
        const temp = arr[index + 1];
        arr[index + 1] = arr[index];
        arr[index] = temp;

        setSections(arr);
    };

    const moveSectionUp = index => () => {
        const arr = [...sections];
        const temp = arr[index - 1];
        arr[index - 1] = arr[index];
        arr[index] = temp;

        setSections(arr);
    };

    const startUpload = index => {
        const arr = sections.map((section, i) => {
            if (i === index) {
                section.image.startUpload = true;
            }
            return section;
        });
        setSections(arr);
    };

    const sendImages = () => {
        setIsUploading(true);

        sections.forEach((section, i) => {
            startUpload(i);
        });
    };

    const submitPost = () => {
        const post = {
            title: title,
            sections: sections.map(section => ({
                title: section.title,
                text: section.text,
                image: {
                    url: section.image.url || "",
                    path: section.image.path || "",
                    text: section.image.text || ""
                }
            })),
            editedAt: Date.now(),
            createdAt: postId ? props.post.createdAt : Date.now()
        };
        const db = firestore;
        // Edit post if id is coming from props
        if (postId) {
            db.collection("blogs")
                .doc(postId)
                .set(post)
                .then(() => {
                    console.log("Document edited with ID:", postId);
                    setTitle("");
                    setSections([emptyData]);
                })
                .catch(error => {
                    console.error("Error adding document: ", error);
                })
                .finally(() => setIsUploading(false));
        } else {
            db.collection("blogs")
                .add(post)
                .then(doc => {
                    console.log("Document written with ID:", doc.id);
                    setTitle("");
                    setSections([emptyData]);
                })
                .catch(error => {
                    console.error("Error adding document: ", error);
                })
                .finally(() => setIsUploading(false));
        }
    };

    return (
        <React.Fragment>
            {isUploading ? <LinearProgress variant="query" color="primary" /> : null}
            <div className={classes.root}>
                <div className={classes.flexContainer}>
                    <div className={classes.create}>
                        <Typography variant="h6">
                            {postId ? "Muokkaa postausta" : "Luo uusi postaus"}
                        </Typography>
                        <div className={classes.titleContainer}>
                            <TextField
                                name="title"
                                label="Blogin otsikko"
                                value={title}
                                onChange={changeTitle}
                                style={{ width: "75%" }}
                                fullWidth
                                required
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={isUploading || !title}
                                onClick={sendImages}
                            >
                                {postId ? "Tallenna" : "Luo uusi"}
                            </Button>
                        </div>
                        {sections.map((section, i) => (
                            <div key={i} className={classes.createSection}>
                                <CreateBlogSection
                                    index={i}
                                    value={section}
                                    onChange={editSection(i)}
                                    remove={removeSection(i)}
                                    moveUp={i > 0 ? moveSectionUp(i) : null}
                                    moveDown={
                                        i < sections.length - 1 ? moveSectionDown(i) : null
                                    }
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
                        <Blog post={{ title, sections }} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: "90%",
        margin: "auto",
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
        margin: theme.spacing(2)
    },
    createSection: {
        margin: theme.spacing(2)
    },
    preview: {
        width: "60vw",
        marginTop: 46
    },
    titleContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: theme.spacing(2)
    }
}));

export default connect(null, { setLoading })(CreateBlog);
