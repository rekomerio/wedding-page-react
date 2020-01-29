import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setUser } from "../redux/actions";
import { HashRouter as Router } from "react-router-dom";
import { auth, firestore } from "../firebase";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "../Theme";
import Nav from "./Nav";
import Login from "./Login";
import LoadingScreen from "./LoadingScreen";
import Routes from "./Routes";

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
                            setUser({ uid: usr.uid, ...data, isSignedIn: true });
                        }
                    });
            } else {
                setUser({ uid: null, isSignedIn: false });
            }
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            {user.uid === null && user.isSignedIn === null ? (
                <LoadingScreen />
            ) : user.isSignedIn === false ? (
                <Login />
            ) : (
                <Router>
                    <Nav />
                    <Routes />
                </Router>
            )}
        </ThemeProvider>
    );
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, { setUser })(App);
