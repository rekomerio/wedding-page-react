import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { formatDistance } from "date-fns";
import { fi } from "date-fns/locale";

const Blog = props => {
    const classes = useStyles();
    const { title, sections, date } = props;
    const temp = [...sections];

    const parsedSections = temp.map(section => {
        section.sentences = section.text.split("\n");
        return section;
    });

    const getTime = () => {
        if (date) {
            return formatDistance(date, new Date(), { locale: fi }) + " sitten";
        }
        return null;
    };
    return (
        <Paper elevation={2} className={classes.root}>
            <header className={classes.header}>
                <Typography variant="h4">{title || "Otsikko"}</Typography>
                <Typography variant="subtitle2">{getTime()}</Typography>
            </header>
            <div>
                {parsedSections.map((section, i) => (
                    <div key={i}>
                        {section.sentences.map((sentence, j) =>
                            sentence ? (
                                <Typography key={j} variant="body1">
                                    {sentence}
                                </Typography>
                            ) : (
                                <br />
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
        padding: theme.spacing(1),
        maxWidth: 1000
    },
    header: {
        marginBottom: theme.spacing(2)
    },
    imageContainer: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    imageCaption: {
        marginTop: theme.spacing(-1),
        padding: theme.spacing(1),
        borderBottomLeftRadius: theme.spacing(1),
        borderBottomRightRadius: theme.spacing(1),
        color: "white",
        backgroundColor: theme.palette.primary.main
    },
    image: {
        width: "100%"
    }
}));

export default Blog;
