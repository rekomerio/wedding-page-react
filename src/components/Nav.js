import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "../firebase";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LoadingScreen from "./LoadingScreen";
import Drawer from "./Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import Notifications from "./Notifications";

const Nav = (props) => {
    const classes = useStyles();
    const location = useLocation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [title, setTitle] = useState(document.title);

    useEffect(() => {
        setTimeout(() => setTitle(document.title), 50);
    }, [location]);

    const signOut = () => {
        auth.signOut();
    };

    return (
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setIsDrawerOpen((state) => !state)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    <Notifications isOpen />
                    <Button style={{ color: "white" }} onClick={signOut}>
                        <Tooltip title="Kirjaudu ulos">
                            <ExitToAppIcon />
                        </Tooltip>
                    </Button>
                </Toolbar>
                {props.isLoading && <LoadingScreen />}
            </AppBar>
            <div className={classes.spacer}></div>
            <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    spacer: {
        minHeight: 64,
        ["@media (max-width:600px)"]: {
            minHeight: 56,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const mapStateToProps = (state) => ({
    isLoading: state.loadingState.isLoading,
    user: state.user,
});

export default connect(mapStateToProps)(Nav);
