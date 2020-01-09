import React, { useState, useEffect, useRef } from "react";
import Blog from "./Blog";
import { firestore, auth } from "../firebase";
import makeStyles from "@material-ui/core/styles/makeStyles";

const Blogs = props => {
    const classes = useStyles();
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const lastDoc = useRef(null);
    const nothingToLoad = useRef(false);
    const db = useRef(firestore);

    useEffect(() => {
        if (isLoading || blogs.length) return;
        console.log("loading first post...");
        props.setIsLoading(true);
        setIsLoading(true);
        db.current
            .collection("blogs")
            .orderBy("createdAt", "desc")
            .limit(1)
            .get()
            .then(querySnapshot => {
                lastDoc.current = querySnapshot.docs[querySnapshot.docs.length - 1];
                const arr = [];
                querySnapshot.forEach(doc => {
                    arr.push({ ...doc.data(), id: doc.id });
                });
                setBlogs(arr);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
                props.setIsLoading(false);
            });
    }, [props]);

    useEffect(() => {
        const user = auth.currentUser;
        db.current
            .collection("users")
            .doc(user.uid)
            .get()
            .then(doc => {
                const data = doc.data();
                if (data) {
                    setIsAdmin(data.isAdmin);
                }
            });
    }, []);

    useEffect(() => {
        const onScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                if (isLoading || nothingToLoad.current || !lastDoc.current) {
                    return;
                }
                setIsLoading(true);
                props.setIsLoading(true);
                console.log("Getting blog...");
                db.current
                    .collection("blogs")
                    .orderBy("createdAt", "desc")
                    .startAfter(lastDoc.current.data().createdAt)
                    .limit(1)
                    .get()
                    .then(querySnapshot => {
                        if (querySnapshot.docs.length > 0) {
                            lastDoc.current =
                                querySnapshot.docs[querySnapshot.docs.length - 1];
                            const arr = [];
                            querySnapshot.forEach(doc => {
                                arr.push({ ...doc.data(), id: doc.id });
                            });
                            setBlogs([...blogs, ...arr]);
                        } else {
                            console.log("All loaded");
                            nothingToLoad.current = true;
                        }
                    })
                    .catch(err => console.log(err))
                    .finally(() => {
                        setIsLoading(false);
                        props.setIsLoading(false);
                    });
            }
        };
        document.addEventListener("scroll", onScroll);

        return () => document.removeEventListener("scroll", onScroll);
    }, [isLoading, blogs, props]);

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
