import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setLoading } from "../redux/actions";
import { firestore } from "../firebase";
import { useParams } from "react-router-dom";
import CreateBlog from "./CreateBlog";

const EditBlogPost = props => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (!id) return;
        const db = firestore;

        props.setLoading(true);
        db.collection("blogs")
            .doc(id)
            .get()
            .then(doc => {
                setPost({ ...doc.data(), id });
            })
            .catch(err => console.error(err))
            .finally(() => props.setLoading(false));
    }, [id, props]);

    return (
        <React.Fragment>
            <CreateBlog post={post} />
        </React.Fragment>
    );
};

export default connect(null, { setLoading })(EditBlogPost);
