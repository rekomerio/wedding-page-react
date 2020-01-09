import React, { useEffect, useRef, useState } from "react";
import { firestore } from "../firebase";
import CreateItem from "./CreateItem";
import ConfirmOrDisagree from "./ConfirmOrDisagree";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useParams } from "react-router-dom";

const EditUser = () => {
    const classes = useStyles();
    const { id } = useParams();
    const [userName, setUserName] = useState("");
    const [user, setUser] = useState({});
    const [familyMembers, setFamilyMembers] = useState([]);
    const [checkBox, setCheckBox] = useState({
        isAvecAllowed: false,
        isFamilyAllowed: false,
        isAllowedToConfirm: true
    });
    const [shouldSave, setShouldSave] = useState(false);
    const db = useRef(firestore);

    useEffect(() => {
        if (id) {
            db.current
                .collection("users")
                .doc(id)
                .get()
                .then(doc => {
                    const userData = doc.data();
                    if (!userData) {
                        return;
                    }
                    setUser(userData);
                    setCheckBox({
                        isAvecAllowed: userData.isAvecAllowed,
                        isFamilyAllowed: userData.isFamilyAllowed,
                        isAllowedToConfirm: userData.isAllowedToConfirm
                    });
                    setUserName(userData.name);
                    // Get potential family members
                    db.current
                        .collection("guests")
                        .where("account", "==", id)
                        .get()
                        .then(querySnapshot => {
                            const arr = [];
                            querySnapshot.forEach(docs => {
                                if (docs.data().isAvec || docs.data().isFamilyMember)
                                    arr.push({
                                        ...docs.data(),
                                        id: docs.id,
                                        isSaved: true,
                                        isSaving: false
                                    });
                            });
                            setFamilyMembers(arr);
                        });
                });
        }
    }, []);

    useEffect(() => {
        setShouldSave(
            checkBox.isAvecAllowed !== user.isAvecAllowed ||
                checkBox.isFamilyAllowed !== user.isFamilyAllowed ||
                checkBox.isAllowedToConfirm !== user.isAllowedToConfirm ||
                userName !== user.name
        );
    }, [user, checkBox, userName]);

    const saveFamilyMember = index => () => {
        if (!familyMembers[index]) {
            return;
        }

        modifyFamilyMember(index, { isSaving: true });
        db.current
            .collection("guests")
            .add({
                account: id,
                name: familyMembers[index].name,
                isComing: null,
                isFamilyMember: true,
                isAvec: false,
                confirmedAt: null,
                createdAt: Date.now()
            })
            .then(res => {
                modifyFamilyMember(index, { isSaved: true, id: res.id });
            })
            .catch(err => console.log(err))
            .finally(() => modifyFamilyMember(index, { isSaving: false }));
    };

    const saveUserInformation = () => {
        if (checkBox.isFamilyAllowed && familyMembers.find(member => !member.isSaved)) {
            if (!window.confirm("Kaikkia perheenjäseniä ei ole vielä tallennettu!")) {
                return;
            }
        }

        const data = {
            isAvecAllowed: checkBox.isAvecAllowed,
            isFamilyAllowed: checkBox.isFamilyAllowed,
            isAllowedToConfirm: checkBox.isAllowedToConfirm,
            name: userName
        };

        db.current
            .collection("users")
            .doc(id)
            .set(data, { merge: true })
            .then(() => {
                setUser(Object.assign(user, data));
                setShouldSave(false);
            })
            .catch(err => console.log(err));
    };

    const deleteFamilyMember = (id, index) => () => {
        db.current
            .collection("guests")
            .doc(id)
            .delete()
            .then(() => {
                console.log("deleted", id);
                removeFamilyMember(index)();
            })
            .catch(err => console.log(err));
    };

    const addFamilyMember = name => {
        setFamilyMembers([...familyMembers, { name: name, isSaved: false, isSaving: false }]);
    };

    const modifyFamilyMember = (index, object) => {
        const arr = [...familyMembers];
        arr[index] = Object.assign(arr[index], object);
        setFamilyMembers(arr);
    };

    const removeFamilyMember = index => () => {
        setFamilyMembers(familyMembers.filter((m, i) => i !== index));
    };

    const handleCheckBoxChange = event => {
        console.log(event.target.name, event.target.checked);
        setCheckBox({ ...checkBox, [event.target.name]: event.target.checked });
    };

    const handleUserName = e => {
        setUserName(e.target.value);
    };

    const checkButtonStatusText = index => {
        const name = familyMembers[index].name;
        if (familyMembers[index].isSaving) return "Tallennetaan henkilöä " + name;
        if (familyMembers[index].isSaved) return "Henkilö " + name + " on tallennettu";
        return "Tallenna henkilö " + name;
    };

    if (!user.email) {
        return <div>User {id} does not exist</div>;
    }

    return (
        <div className={classes.root}>
            <Typography variant="h6">{user.email}</Typography>
            <TextField label="Käyttäjän nimi" value={userName} onChange={handleUserName} />
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Käyttäjä saa tuoda mukanaan:</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checkBox.isAvecAllowed}
                                onChange={handleCheckBoxChange}
                                disabled={!checkBox.isAllowedToConfirm}
                                name="isAvecAllowed"
                            />
                        }
                        label="Avecin"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checkBox.isFamilyAllowed}
                                onChange={handleCheckBoxChange}
                                disabled={!checkBox.isAllowedToConfirm}
                                name="isFamilyAllowed"
                            />
                        }
                        label="Perheenjäseniä"
                    />
                    <FormControlLabel
                        control={<Checkbox checked disabled />}
                        label="Itsensä"
                    />
                </FormGroup>
                <FormHelperText>Oletuksena on se, että muita ei saa tuoda</FormHelperText>
            </FormControl>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Extras</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checkBox.isAllowedToConfirm}
                                onChange={handleCheckBoxChange}
                                name="isAllowedToConfirm"
                            />
                        }
                        label="Ilmoittautuminen on avoin käyttäjälle"
                    />
                </FormGroup>
            </FormControl>
            {familyMembers.length || checkBox.isFamilyAllowed ? (
                <div className={classes.family}>
                    <Typography variant="subtitle1">Lisää perheenjäseniä</Typography>
                    <CreateItem label="Nimi" add={addFamilyMember} />
                    {familyMembers.map((member, i) => (
                        <ConfirmOrDisagree
                            key={i}
                            text={member.name}
                            label={`Henkilön nimi / Tyyppi: ${
                                member.isAvec ? "Avec" : "Perheenjäsen"
                            }`}
                            confirmText={checkButtonStatusText(i)}
                            disagreeText={"Poista " + member.name}
                            confirmDisabled={member.isSaving || member.isSaved}
                            disagreeDisabled={member.isSaving}
                            onConfirm={saveFamilyMember(i)}
                            onDisagree={
                                member.isSaved
                                    ? deleteFamilyMember(member.id, i)
                                    : removeFamilyMember(i)
                            }
                        />
                    ))}
                </div>
            ) : null}
            <Button
                variant="contained"
                color="primary"
                disabled={!shouldSave}
                onClick={saveUserInformation}
            >
                {shouldSave ? "Tallenna muuttuneet tiedot" : "Tiedot ovat ajan tasalla"}
            </Button>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: 700,
        margin: "auto",
        "& > *": {
            margin: theme.spacing(1)
        }
    },
    family: {
        "& > *": {
            margin: theme.spacing(1)
        }
    },
    formControl: {
        width: "100%"
    }
}));

export default EditUser;
