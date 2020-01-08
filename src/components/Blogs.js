import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Blog from "./Blog";
import firebase from "../firebase";
import makeStyles from "@material-ui/core/styles/makeStyles";

const Blogs = () => {
    const classes = useStyles();
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        document.title = "Blogi";
        const db = firebase.firestore();

        db.collection("blogs")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get()
            .then(querySnapshot => {
                const arr = [];
                querySnapshot.forEach(doc => {
                    arr.push({ ...doc.data(), id: doc.id });
                });
                setBlogs(arr);
            });
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.blogs}>
                {blogs.map(blog => (
                    <div key={blog.id} className={classes.blog}>
                        <Blog post={blog} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        "& > *": {
            margin: theme.spacing(0)
        }
    },
    blogs: {
        display: "flex",
        ["@media (max-width:800px)"]: {
            // eslint-disable-line no-useless-computed-key
            flexDirection: "column"
        }
    },
    blog: {
        margin: theme.spacing(2)
    }
}));

export default Blogs;
