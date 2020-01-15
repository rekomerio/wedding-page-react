import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setUser } from "../redux/actions";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import { auth, firestore } from "../firebase";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "../Theme";
import Nav from "./Nav";
import CreateBlog from "./CreateBlog";
import Login from "./Login";
import CreateGiftList from "./CreateGiftList";
import LoadingScreen from "./LoadingScreen";
import ReserveGift from "./ReserveGift";
import EditUser from "./EditUser";
import ConfirmComing from "./ConfirmComing";
import Users from "./Users";
import Guests from "./Guests";
import EditBlogPost from "./EditBlogPost";
import Homepage from "./Homepage";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import GroupIcon from "@material-ui/icons/Group";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import HomeIcon from "@material-ui/icons/Home";
import PostAddIcon from "@material-ui/icons/PostAdd";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

const App = props => {
    const { user, setUser } = props;

    useEffect(() => {
        auth.onAuthStateChanged(usr => {
            if (usr) {
                const db = firestore;
                db.collection("users")
                    .doc(usr.uid)
                    .get()
                    .then(doc => {
                        const data = doc.data();
                        if (data) {
                            setUser({ uid: usr.uid, ...data, isSignedIn: true });
                        }
                    });
            } else {
                setUser({ uid: null, isSignedIn: false });
            }
        });
    }, []);

    const links = [
        { path: "/", text: "Etusivu", icon: <HomeIcon /> },
        { path: "/user/confirm", text: "Ilmoittautuminen", icon: <PersonAddIcon /> },
        { path: "/giftlist/reserve", text: "Lahjalista", icon: <CardGiftcardIcon /> }
    ];

    if (user && user.isAdmin) {
        links.push({ path: "/blog/create", text: "Uusi postaus", icon: <PostAddIcon /> });
        links.push({
            path: "/giftlist/create",
            text: "Lahjalistan hallinta",
            icon: <CardGiftcardIcon />
        });
        links.push({ path: "/guests", text: "Vieraslista", icon: <GroupIcon /> });
        links.push({ path: "/users", text: "Käyttäjät", icon: <SupervisedUserCircleIcon /> });
    }

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <div className="App">
                    {user.uid === null && user.isSignedIn === null ? (
                        <Route path="/" component={LoadingScreen} />
                    ) : user.isSignedIn === false ? (
                        <>
                            <Route path="/" component={Login} />
                            <Route path="/welcome/:email/:password" component={Login} />
                        </>
                    ) : (
                        <>
                            <Nav links={links} />
                            <Route path="/login">
                                <Redirect to="/" />
                            </Route>
                            <Route path="/welcome/:email/:password">
                                <Redirect to="/user/confirm" />
                            </Route>
                            <Route exact path="/" component={Homepage} />
                            <Route path="/user/confirm" component={ConfirmComing} />
                            <Route path="/giftlist/reserve" component={ReserveGift} />
                            <Route
                                path="/blog/create"
                                component={user.isAdmin ? CreateBlog : LoadingScreen}
                            />
                            <Route
                                path="/blog/edit/:id"
                                component={user.isAdmin ? EditBlogPost : LoadingScreen}
                            />
                            <Route
                                path="/giftlist/create"
                                component={user.isAdmin ? CreateGiftList : LoadingScreen}
                            />
                            <Route
                                path="/user/:id/edit"
                                component={user.isAdmin ? EditUser : LoadingScreen}
                            />
                            <Route
                                path="/users"
                                component={user.isAdmin ? Users : LoadingScreen}
                            />
                            <Route
                                path="/guests"
                                component={user.isAdmin ? Guests : LoadingScreen}
                            />
                        </>
                    )}
                </div>
            </ThemeProvider>
        </Router>
    );
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, { setUser })(App);
