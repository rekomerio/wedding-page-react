import React, { useState, useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import { setLoading } from "../redux/actions";
import { firestore } from "../firebase";
import Blog from "./Blog";
import makeStyles from "@material-ui/core/styles/makeStyles";

const isPageAtBottom = () => window.innerHeight + window.scrollY >= document.body.offsetHeight;

const Blogs = (props) => {
    const classes = useStyles();
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const lastDoc = useRef(null);
    const nothingToLoad = useRef(false);
    const { user } = props;

    useEffect(() => {
        document.title = "Meistä ja häistä";
    }, []);

    useEffect(() => {
        console.log("loading first post...");
        props.setLoading(true);
        setIsLoading(true);
        firestore
            .collection("blogs")
            .orderBy("createdAt", "desc")
            .limit(1)
            .get()
            .then((querySnapshot) => {
                lastDoc.current = querySnapshot.docs[querySnapshot.docs.length - 1];
                const arr = [];
                querySnapshot.forEach((doc) => {
                    arr.push({ ...doc.data(), id: doc.id });
                });
                setBlogs(arr);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsLoading(false);
                props.setLoading(false);
            });
    }, []);

    const loadNextPost = useCallback(() => {
        if (isLoading || nothingToLoad.current || !lastDoc.current) {
            return;
        }

        setIsLoading(true);
        props.setLoading(true);
        console.log("Getting blog...");
        firestore
            .collection("blogs")
            .orderBy("createdAt", "desc")
            .startAfter(lastDoc.current.data().createdAt)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.docs.length > 0) {
                    lastDoc.current = querySnapshot.docs[querySnapshot.docs.length - 1];
                    const arr = [];
                    querySnapshot.forEach((doc) => {
                        arr.push({ ...doc.data(), id: doc.id });
                    });
                    setBlogs((state) => [...state, ...arr]);
                } else {
                    console.log("All loaded");
                    nothingToLoad.current = true;
                }
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsLoading(false);
                props.setLoading(false);
            });
    }, [isLoading]);

    useEffect(() => {
        const onScroll = () => {
            if (isPageAtBottom()) loadNextPost();
        };
        document.addEventListener("scroll", onScroll);

        return () => document.removeEventListener("scroll", onScroll);
    }, [isLoading, blogs, loadNextPost]);

    // This effect is run in case some blog is so short, that scrolling is not possible
    useEffect(() => {
        if (isPageAtBottom()) loadNextPost();
    }, [blogs, isLoading, loadNextPost]);

    return (
        <div className={classes.root}>
            <div className={classes.blogs}>
                {blogs.map((blog) => (
                    <div key={blog.id} className={classes.blog}>
                        <Blog post={blog} isEditable={user.isAdmin} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "auto",
        maxWidth: 800,
        "& > *": {
            margin: theme.spacing(0),
        },
    },
    blogs: {},
    blog: {
        margin: theme.spacing(2),
    },
}));

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps, { setLoading })(Blogs);
