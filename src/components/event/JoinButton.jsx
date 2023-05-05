import { useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import useFirestore from "@/firebase/firestore";

const JoinButton = ({ eventId }) => {
    const { user } = useAuthContext();
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState();
    const eventsHook = useFirestore("events");

    const handleJoinClick = async () => {
        try {
            setIsJoining(true);
            const event = await eventsHook.getDocumentById(eventId);
            const attendees = event.attendees || [];

            if (!attendees.includes(user.displayName)) {
                const updatedAttendees = [...attendees, user.displayName];
                await eventsHook.updateDocumentById(eventId, {
                    attendees: updatedAttendees,
                });
            }

            setIsJoining(false);
        } catch (error) {
            console.error("Error joining Eevent", error);
            setError(error);
            setIsJoining(false);
        }
    };

    return (
        <div className='py-12 order-3 lg:order-none px-4'>
            <button
                onClick={handleJoinClick}
                disabled={isJoining}
                className='w-full bg-primary-200 focus:outline-none text-white font-semibold rounded-lg text-md px-32 py-3 '
            >
                Join
            </button>
        </div>
    );
};

export default JoinButton;
