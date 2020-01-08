import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Zoom from "@material-ui/core/Zoom";
import Typography from "@material-ui/core/Typography";
import firebase from "../firebase";

const Login = () => {
    const classes = useStyles();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        firebase
            .auth()
            .signInWithEmailAndPassword(credentials.email, credentials.password)
            .catch(error => {
                console.log(error.message);
                setMessage(error.message);
            })
            .finally(() => setIsSubmitting(false));
    };

    useEffect(() => {
        document.title = "Kirjautuminen";
        const params = window.location.hash.split("/");
        const [a, b, email, password] = params;
        if (email && password) {
            setCredentials({ email, password });
        }
    }, []);

    const handleChange = e => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const fieldsAreEmpty = () =>
        credentials.email.length === 0 || credentials.password.length === 0;

    return (
        <div className={classes.loginWindow}>
            <div>
                <Typography variant="h5">Hääsivusto</Typography>
                <form
                    className={classes.form}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        label="Email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        type="email"
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Salasana"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        variant="outlined"
                        fullWidth
                    />
                    <Zoom in={Boolean(message)}>
                        <Typography variant="subtitle2" gutterBottom>
                            {message}
                        </Typography>
                    </Zoom>
                    <Button
                        classes={{ root: classes.button }}
                        type="submit"
                        variant="contained"
                        color="secondary"
                        disabled={isSubmitting || fieldsAreEmpty()}
                    >
                        Kirjaudu sisään
                    </Button>
                </form>
            </div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    loginWindow: {
        margin: "auto",
        width: 500,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        ["@media (max-width:500px)"]: {
            // eslint-disable-line no-useless-computed-key
            width: "100%"
        }
    },
    form: {
        margin: theme.spacing(2),
        minWidth: 240,
        "& .MuiTextField-root": {
            margin: theme.spacing(1)
        }
    },
    button: {
        display: "block",
        margin: theme.spacing(1),
        width: "100%"
    }
}));

export default Login;
