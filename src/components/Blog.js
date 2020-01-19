import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import { formatDistance } from "date-fns";
import { fi } from "date-fns/locale";
import { Link } from "react-router-dom";

const Blog = props => {
    const classes = useStyles();
    const { post, isEditable } = props;

    const parsedSections = post.sections.map(section => {
        const sectionCopy = { ...section };
        sectionCopy.sentences = sectionCopy.text.split("\n");
        return sectionCopy;
    });

    const getCreatedAt = () => {
        if (post && post.createdAt) {
            return (
                <React.Fragment>
                    <Typography variant="subtitle2">
                        Luotu:{" "}
                        {formatDistance(post.createdAt, new Date(), { locale: fi }) +
                            " sitten"}
                    </Typography>
                </React.Fragment>
            );
        }
        return null;
    };

    const getEditedAt = () => {
        if (post && post.editedAt) {
            if (post.editedAt === post.createdAt) return null;
            return (
                <React.Fragment>
                    <Typography variant="subtitle2">
                        Muokattu viimeksi:
                        {formatDistance(post.editedAt, new Date(), { locale: fi }) + " sitten"}
                    </Typography>
                </React.Fragment>
            );
        }
        return null;
    };

    if (!post)
        return (
            <Paper elevation={2} className={classes.root}>
                Nothing to show
            </Paper>
        );
    return (
        <Paper elevation={2} className={classes.root}>
            <header className={classes.header}>
                {isEditable && post.id ? (
                    <Link style={{ float: "right" }} to={"/blog/edit/" + post.id}>
                        <Fab size="small" color="primary">
                            <EditIcon />
                        </Fab>
                    </Link>
                ) : null}
                <Typography variant="h4">{post.title || "Otsikko"}</Typography>
                <div>{getCreatedAt()}</div>
            </header>
            <div>
                {parsedSections.map((section, i) => (
                    <div key={i} className={classes.section}>
                        <Typography className={classes.text} variant="h6">
                            {section.title}
                        </Typography>
                        {section.sentences.map((sentence, j) =>
                            sentence ? (
                                <Typography key={j} className={classes.text} variant="body1">
                                    {sentence}
                                </Typography>
                            ) : (
                                <br key={j} />
                            )
                        )}
                        {section.image.url ? (
                            <div className={classes.imageContainer}>
                                <img
                                    className={classes.image}
                                    alt={section.image.text}
                                    src={section.image.url}
                                />
                                {section.image.text ? (
                                    <div className={classes.imageCaption}>
                                        <Typography variant="caption">
                                            {section.image.text}
                                        </Typography>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </Paper>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 1000,
        paddingBottom: theme.spacing(2)
    },
    header: {
        padding: theme.spacing(2)
    },
    section: {
        marginBottom: theme.spacing(3)
    },
    imageContainer: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    imageCaption: {
        marginTop: theme.spacing(-1),
        padding: theme.spacing(1),
        color: "white",
        backgroundColor: theme.palette.primary.main
    },
    image: {
        width: "100%"
    },
    text: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4)
    }
}));

export default Blog;
