import React, { useState } from "react";
import { connect } from "react-redux";
import { firestore } from "../../firebase";
import Menu from "./Menu";

const Notifications = (props) => {
    const [notifications, setNotifications] = useState([]);
    const { user } = props;

    React.useEffect(() => {
        if (!user) return;

        const unsubscribe = firestore
            .collection("notifications")
            .where("user", "==", user.uid)
            .where("isRead", "==", false)
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    const data = change.doc.data();
                    console.log(change.doc.id);
                    if (change.type === "added") {
                        setNotifications((state) => {
                            return [
                                ...state,
                                {
                                    ...data,
                                    id: change.doc.id,
                                },
                            ];
                        });
                    }

                    if (change.type === "modified") {
                        if (data.isRead) {
                            setNotifications((state) => {
                                return state.filter(
                                    (notification) => notification.id !== change.doc.id
                                );
                            });
                        } else {
                            setNotifications((state) => {
                                return state.map((notification) => {
                                    if (notification.id === change.doc.id) {
                                        notification = {
                                            ...data,
                                            id: change.doc.id,
                                        };
                                    }
                                    return notification;
                                });
                            });
                        }
                    }

                    if (change.type === "removed") {
                        setNotifications((state) => {
                            return state.filter(
                                (notification) => notification.id !== change.doc.id
                            );
                        });
                    }
                });
            });
        return unsubscribe;
    }, [user]);

    return <Menu notifications={notifications} />;
};

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps)(Notifications);
