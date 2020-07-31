import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import ClearIcon from "@material-ui/icons/Clear";
import { firestore } from "../../firebase";
import { useHistory } from "react-router-dom";
import { formatDistance } from "date-fns";
import { fi } from "date-fns/locale";
import makeStyles from "@material-ui/core/styles/makeStyles";

const NotificationMenu = ({ notifications }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClearNotification = (id, action) => {
        firestore
            .collection("notifications")
            .doc(id)
            .set({ isRead: true, readAt: Date.now() }, { merge: true })
            .then(() => action && action())
            .catch((err) => console.error(err.message));
    };

    return (
        <div>
            <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                color="inherit"
            >
                <Badge badgeContent={notifications.length} color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <div className={classes.menu}>
                    <Box marginLeft={2} marginTop={1}>
                        <Typography variant="body1">
                            Sinulle on {notifications.length}{" "}
                            {notifications.length === 1 ? "uusi ilmoitus" : "uutta ilmoitusta"}
                        </Typography>
                    </Box>
                    {notifications.length ? (
                        notifications.map(({ id, href, title, text, createdAt }) => (
                            <Paper
                                square
                                elevation={0}
                                key={id}
                                className={classes.paper}
                                style={{ cursor: href ? "pointer" : "default" }}
                            >
                                <div className={classes.notificationItem}>
                                    <div
                                        className={classes.flex}
                                        onClick={
                                            href
                                                ? () =>
                                                      handleClearNotification(id, () =>
                                                          history.push(href)
                                                      )
                                                : null
                                        }
                                    >
                                        <Avatar alt="icon">
                                            <NotificationsIcon />
                                        </Avatar>
                                        <Box marginLeft={2}>
                                            <Typography variant="subtitle1">
                                                {title || "Uusi ilmoitus"}
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                {text || "Ilmoitus"}
                                            </Typography>
                                        </Box>
                                    </div>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleClearNotification(id)}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </div>
                                <Box marginLeft={7}>
                                    <Typography variant="caption">
                                        {formatDistance(createdAt, new Date(), {
                                            locale: fi,
                                        }) + " sitten"}
                                    </Typography>
                                </Box>
                            </Paper>
                        ))
                    ) : (
                        <div className={classes.wrapper}>
                            <Typography variant="subtitle1" align="center">
                                Ei uusia ilmoituksia
                            </Typography>
                        </div>
                    )}
                </div>
            </Menu>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    menu: {
        width: 300,
        height: 350,
    },
    flex: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    paper: {
        padding: theme.spacing(2),
        "&:hover": {
            backgroundColor: theme.palette.background.default,
        },
    },
    notificationItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    wrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "90%",
    },
}));

export default NotificationMenu;
