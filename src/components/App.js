import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setUser } from "../redux/actions";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
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
import WishSong from "./WishSong";
import Songs from "./Songs";
import AuthorizedRoute from "./AuthorizedRoute";
import NotFound from "./NotFound";

const App = props => {
    const { user, setUser } = props;

    useEffect(() => {
        auth.onAuthStateChanged(usr => {
            if (usr) {
                firestore
                    .collection("users")
                    .doc(usr.uid)
                    .get()
                    .then(doc => {
                        const data = doc.data();
                        if (data) {
                            setUser({
                                uid: usr.uid,
                                ...data,
                                isSignedIn: true
                            });
                        }
                    });
            } else {
                setUser({ uid: null, isSignedIn: false });
            }
        });
    }, []);

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
                            <Nav />
                            <Switch>
                                <Route path="/login">
                                    <Redirect to="/" />
                                </Route>
                                <Route path="/welcome/:email/:password">
                                    <Redirect to="/user/confirm" />
                                </Route>
                                <Route exact path="/" component={Homepage} />
                                <Route path="/user/confirm" component={ConfirmComing} />
                                <Route path="/giftlist/reserve" component={ReserveGift} />
                                <Route path="/songs/wish" component={WishSong} />
                                <AuthorizedRoute
                                    path="/songs/all"
                                    authorized={user.isAdmin}
                                    component={Songs}
                                />
                                <AuthorizedRoute
                                    path="/blog/create"
                                    authorized={user.isAdmin}
                                    component={CreateBlog}
                                />
                                <AuthorizedRoute
                                    path="/blog/edit/:id"
                                    authorized={user.isAdmin}
                                    component={EditBlogPost}
                                />
                                <AuthorizedRoute
                                    path="/giftlist/create"
                                    authorized={user.isAdmin}
                                    component={CreateGiftList}
                                />
                                <AuthorizedRoute
                                    path="/user/:id/edit"
                                    authorized={user.isAdmin}
                                    component={EditUser}
                                />
                                <AuthorizedRoute
                                    path="/users"
                                    authorized={user.isAdmin}
                                    component={Users}
                                />
                                <AuthorizedRoute
                                    path="/guests"
                                    authorized={user.isAdmin}
                                    component={Guests}
                                />
                                <Route>
                                    <NotFound />
                                </Route>
                            </Switch>
                        </>
                    )}
                </div>
            </ThemeProvider>
        </Router>
    );
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, { setUser })(App);
