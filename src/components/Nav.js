import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../firebase";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Tooltip from "@material-ui/core/Tooltip";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LoadingScreen from "./LoadingScreen";

const Nav = props => {
    const classes = useStyles();
    const matches = useMediaQuery(
        props.user.isAdmin ? "(max-width:1100px)" : "(max-width:600px)"
    );

    const [title, setTitle] = React.useState(document.title);

    React.useEffect(() => {
        const interval = setInterval(() => setTitle(document.title), 250);
        return () => clearInterval(interval);
    }, []);

    const signOut = () => {
        auth.signOut();
    };

    return (
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        {props.user.isAdmin && matches ? null : title}
                    </Typography>
                    {props.links.map((link, i) => (
                        <Link key={i} to={link.path}>
                            <Button color="inherit">
                                {matches ? (
                                    <Tooltip title={link.text}>{link.icon}</Tooltip>
                                ) : (
                                    link.text
                                )}
                            </Button>
                        </Link>
                    ))}
                    <Button style={{ color: "white" }} onClick={signOut}>
                        <Tooltip title="Kirjaudu ulos">
                            <ExitToAppIcon />
                        </Tooltip>
                    </Button>
                </Toolbar>
                {props.isLoading ? <LoadingScreen /> : null}
            </AppBar>
            <div className={classes.spacer}></div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    spacer: {
        minHeight: 64,
        ["@media (max-width:600px)"]: {
            minHeight: 56
        }
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));

const mapStateToProps = state => ({
    isLoading: state.loadingState.isLoading,
    user: state.user
});

export default connect(mapStateToProps)(Nav);
