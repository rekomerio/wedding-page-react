import React, { useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import firebase from "../firebase";
import { useParams } from "react-router-dom";
import CreateBlog from "./CreateBlog";

const EditBlogPost = () => {
    const classes = useStyles();
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (!id) return;
        const db = firebase.firestore();
        db.collection("blogs")
            .doc(id)
            .get()
            .then(doc => {
                setPost({ ...doc.data(), id });
            });
    }, [id]);

    return (
        <React.Fragment>
            <CreateBlog post={post} />
        </React.Fragment>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        "& > *": {
            margin: theme.spacing(2)
        }
    }
}));

export default EditBlogPost;
