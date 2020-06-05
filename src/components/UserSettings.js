import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { auth } from "../firebase";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useSnackbar } from "notistack";

const UserSettings = (props) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState("");
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
    });

    useEffect(() => {
        document.title = "Asetukset";
        if (props.user) setCredentials({ ...credentials, email: props.user.email });
    }, []);

    const checkMatch = () => {
        if (credentials.password !== credentials.passwordConfirm) {
            setError("Salasanat eivät täsmää");
        } else {
            setError("");
        }
    };

    const changePassword = () => {
        if (credentials.password !== credentials.passwordConfirm) {
            enqueueSnackbar("Salasanat eivät täsmää", {
                variant: "info",
            });
            return;
        }

        if (credentials.password.length < 6) {
            enqueueSnackbar("Salasanan tulee olla vähintään 6 merkkiä pitkä", {
                variant: "info",
            });
            return;
        }
        auth.currentUser
            .updatePassword(credentials.password)
            .then(() => {
                enqueueSnackbar("Salasana vaihdettu", {
                    variant: "success",
                });
            })
            .catch((err) => {
                enqueueSnackbar(err.message, {
                    variant: "error",
                });
            });
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className={classes.loginWindow}>
            <div className={classes.form}>
                <Typography variant="h5">Asetukset</Typography>
                <TextField
                    label="Uusi salasana"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Salasana uudestaan"
                    name="passwordConfirm"
                    value={credentials.passwordConfirm}
                    onChange={handleChange}
                    onBlur={checkMatch}
                    type="password"
                    variant="outlined"
                    error={Boolean(error)}
                    helperText={error}
                    fullWidth
                />
                <Button
                    classes={{ root: classes.button }}
                    variant="contained"
                    color="secondary"
                    disabled={
                        !credentials.password.length || !credentials.passwordConfirm.length
                    }
                    onClick={changePassword}
                >
                    Vaihda salasana
                </Button>
            </div>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    loginWindow: {
        margin: "auto",
        width: 500,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        ["@media (max-width:500px)"]: {
            // eslint-disable-line no-useless-computed-key
            width: "100%",
        },
    },
    form: {
        margin: theme.spacing(2),
        width: "100%",
        minWidth: 240,
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
        },
    },
    button: {
        display: "block",
        margin: theme.spacing(1),
        width: "100%",
    },
}));

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(UserSettings);
