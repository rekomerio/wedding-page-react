import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import firebase from "../firebase";

const Nav = props => {
    const classes = useStyles();
    const [title, setTitle] = React.useState(document.title);

    React.useEffect(() => {
        setInterval(() => setTitle(document.title), 100);
    }, []);

    const signOut = () => {
        firebase.auth().signOut();
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    {props.links.map((link, i) => (
                        <Link key={i} to={link.path}>
                            <Button color="inherit">{link.text}</Button>
                        </Link>
                    ))}
                    <Button style={{ color: "white" }} onClick={signOut}>
                        Kirjaudu ulos
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));

export default Nav;
