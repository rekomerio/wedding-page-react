import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import QueueMusicIcon from "@material-ui/icons/QueueMusic";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import GroupIcon from "@material-ui/icons/Group";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import HomeIcon from "@material-ui/icons/Home";
import PostAddIcon from "@material-ui/icons/PostAdd";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

const Drawer = props => {
    const classes = useStyles();
    const { isOpen, setIsOpen, user } = props;

    const links = [
        { path: "/", text: "Etusivu", icon: <HomeIcon /> },
        { path: "/user/confirm", text: "Ilmoittautuminen", icon: <PersonAddIcon /> },
        { path: "/giftlist/reserve", text: "Lahjalista", icon: <CardGiftcardIcon /> },
        { path: "/songs/wish", text: "Toivo kappaletta", icon: <MusicNoteIcon /> }
    ];

    const privateLinks = [
        { path: "/blog/create", text: "Uusi postaus", icon: <PostAddIcon /> },
        { path: "/giftlist/create", text: "Lahjalistan hallinta", icon: <CardGiftcardIcon /> },
        { path: "/guests", text: "Vieraslista", icon: <GroupIcon /> },
        { path: "/users", text: "Käyttäjät", icon: <SupervisedUserCircleIcon /> },
        { path: "/songs/all", text: "Musiikkitoiveet", icon: <QueueMusicIcon /> }
    ];

    return (
        <SwipeableDrawer
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
        >
            <div
                className={classes.list}
                role="presentation"
                onClick={() => setIsOpen(false)}
                onKeyDown={() => setIsOpen(false)}
            >
                <List>
                    {links.map(link => (
                        <Link to={link.path} key={link.text} style={{ color: "#000" }}>
                            <ListItem button>
                                <ListItemIcon>{link.icon}</ListItemIcon>
                                <ListItemText primary={link.text} />
                            </ListItem>
                        </Link>
                    ))}
                </List>

                {user && user.isAdmin && (
                    <>
                        <Divider />
                        <List>
                            {privateLinks.map(link => (
                                <Link to={link.path} key={link.text} style={{ color: "#000" }}>
                                    <ListItem button>
                                        <ListItemIcon>{link.icon}</ListItemIcon>
                                        <ListItemText primary={link.text} />
                                    </ListItem>
                                </Link>
                            ))}
                        </List>
                    </>
                )}
            </div>
        </SwipeableDrawer>
    );
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(Drawer);

const useStyles = makeStyles({
    list: {
        width: 250
    }
});
