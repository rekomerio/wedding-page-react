import React, { useState, useEffect } from "react";
import Blog from "./Blog";
import { firestore, auth } from "../firebase";
import makeStyles from "@material-ui/core/styles/makeStyles";

const Blogs = () => {
    const classes = useStyles();
    const [blogs, setBlogs] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const db = firestore;

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

    useEffect(() => {
        const db = firestore;
        const user = auth.currentUser;
        db.collection("users")
            .doc(user.uid)
            .get()
            .then(doc => {
                const data = doc.data();
                if (data) {
                    setIsAdmin(data.isAdmin);
                }
            });
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.blogs}>
                {blogs.map(blog => (
                    <div key={blog.id} className={classes.blog}>
                        <Blog post={blog} isEditable={isAdmin} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        margin: "auto",
        width: 800,
        ["@media (max-width:800px)"]: {
            // eslint-disable-line no-useless-computed-key
            width: "100%"
        },
        "& > *": {
            margin: theme.spacing(0)
        }
    },
    blogs: {},
    blog: {
        margin: theme.spacing(2)
    }
}));

export default Blogs;
