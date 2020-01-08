import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "../Theme";
import Nav from "./Nav";
import Blogs from "./Blogs";
import CreateBlog from "./CreateBlog";
import Login from "./Login";
import firebase from "../firebase";
import CreateGiftList from "./CreateGiftList";
import LoadingScreen from "./LoadingScreen";
import ReserveGift from "./ReserveGift";
import EditUser from "./EditUser";
import ConfirmComing from "./ConfirmComing";
import Users from "./Users";
import Guests from "./Guests";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(usr => {
            if (usr) {
                const db = firebase.firestore();
                db.collection("users")
                    .doc(usr.uid)
                    .get()
                    .then(doc => {
                        const data = doc.data();
                        if (data) {
                            setUser({ uid: usr.uid, ...data });
                        }
                    });
            } else {
                setUser(false);
            }
        });
    }, []);

    const links = [
        { path: "/", text: "Etusivu" },
        { path: "/user/confirm", text: "Ilmoittautuminen" },
        { path: "/giftlist/reserve", text: "Lahjan varaus" }
    ];

    if (user && user.isAdmin) {
        links.push({ path: "/blog/create", text: "Uusi postaus" });
        links.push({ path: "/giftlist/create", text: "Lahjan luonti" });
        links.push({ path: "/guests", text: "Vieraslista" });
        links.push({ path: "/users", text: "Käyttäjät" });
    }

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <div className="App">
                    {user === false ? (
                        <>
                            <Route path="/" component={Login} />
                            <Route path="/welcome/:email/:password" component={Login} />
                        </>
                    ) : user === null ? (
                        <Route path="/" component={LoadingScreen} />
                    ) : (
                        <>
                            <Nav links={links} />
                            <Route exact path="/" component={Blogs} />
                            <Route path="/login">
                                {user ? <Redirect to="/" /> : <Login />}
                            </Route>
                            <Route path="/welcome/:email/:password">
                                <Redirect to="/user/confirm" />
                            </Route>
                            <Route path="/user/confirm">
                                <ConfirmComing user={user} />
                            </Route>
                            <Route path="/giftlist/reserve">
                                <ReserveGift user={user} />
                            </Route>
                            <Route
                                path="/blog/create"
                                component={user.isAdmin ? CreateBlog : LoadingScreen}
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

export default App;
