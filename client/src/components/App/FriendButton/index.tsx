import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import friendshipReducer, { addFriendship, removeFriendship } from "../../../redux/friendships";

const FriendButton = (props: { ownerId: string }) => {
    const [relation, setRelation] = useState<
        "none" | "sent" | "received" | "friend" | null
    >(null);
    const dispatch = useDispatch();


    const buttonInner = {
        none: "Send Friend Request",
        sent: "Cancel Friend Request",
        received: "Accept Friend Request",
        friend: "Unfriend",
    };

    useEffect(() => {
        fetch(`/relation/${props.ownerId}`)
            .then((response) => response.json())
            .then((data) => {
                data.success ? setRelation(data.relation) : setRelation(null);
            })
            .catch(() => {
                setRelation(null);
            });
    }, [relation]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (relation) {
            fetch(`/friend-request/${relation}/${props.ownerId}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setRelation(data.newRelation);
                        if(data.newRelation === "none"){
                            dispatch(removeFriendship(props.ownerId));
                        } else if (data.newRelation === "friend"){
                            dispatch(addFriendship(props.ownerId));
                        }
                    }
                });
        }
    };

    return (
        <>
            <div className="button-container">
                <button className="friend-button" onClick={handleClick}>
                    {relation && buttonInner[relation]}
                </button>
            </div>
        </>
    );
};

export default FriendButton;
