import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setLoading } from "../redux/actions";
import { firestore, functions } from "../firebase";
import makeStyles from "@material-ui/styles/makeStyles";
import ConfirmOrDisagree from "./ConfirmOrDisagree";
import CreateSongWish from "./CreateSongWish";
import Typography from "@material-ui/core/Typography";

const WishSong = ({ user, setLoading }) => {
    const classes = useStyles();
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        document.title = "Toivo kappaletta";
    }, []);

    useEffect(() => {
        const unsubscribe = firestore
            .collection("songs")
            .where("addedBy", "==", user.uid)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    const data = change.doc.data();
                    if (change.type === "added") {
                        setSongs((state) => {
                            return [
                                ...state,
                                {
                                    ...data,
                                    id: change.doc.id,
                                    isLoading: false,
                                },
                            ];
                        });
                    }
                    if (change.type === "removed") {
                        setSongs((state) => {
                            return state.filter((song) => song.id !== change.doc.id);
                        });
                    }
                });
            });
        return unsubscribe;
    }, [user]);

    const addSong = (song) => {
        setLoading(true);

        const addSong = functions.httpsCallable("addSong");
        addSong(song)
            .then((res) => console.log(res))
            .catch((err) => console.log(err.message))
            .finally(() => setLoading(false));
    };

    const deleteSong = (id) => () => {
        modifySong(id, { isLoading: true });

        const removeSong = functions.httpsCallable("removeSong");
        removeSong({ id })
            .then((res) => console.log(res))
            .catch((err) => console.log(err.message));
    };

    const modifySong = (id, properties) => {
        const arr = songs.map((song) => (song.id === id ? { ...song, ...properties } : song));
        setSongs(arr);
    };

    return (
        <div className={classes.root}>
            <Typography variant="h6">
                Haluisitko kuulla jonkin tietyn kappaleen häissä?
            </Typography>
            <Typography variant="body1">Esitä toiveesi tässä</Typography>
            <div className={classes.songs}>
                {songs.map((song) => (
                    <ConfirmOrDisagree
                        key={song.id}
                        label={song.isLoading ? "Poistetaan..." : "Kappale"}
                        text={song.name + (song.artist ? " - " + song.artist : "")}
                        confirmText="Tämä kappale on toivelistalla"
                        disagreeText={song.isLoading ? "Poistetaan..." : "Poista " + song.name}
                        confirmDisabled={true}
                        disagreeDisabled={song.isLoading}
                        onDisagree={deleteSong(song.id)}
                    />
                ))}
            </div>
            <CreateSongWish onAdd={addSong} />
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    root: { maxWidth: 600, margin: "auto", paddingTop: theme.spacing(6) },
    songs: {
        "& > *": {
            margin: theme.spacing(0.5),
        },
    },
}));

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps, { setLoading })(WishSong);
