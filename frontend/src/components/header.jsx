import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../api/userApi";
import { FiSettings } from "react-icons/fi";

const Header = () => {
    const [user, setUser] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showFullPic, setShowFullPic] = useState(false);
    const navigate = useNavigate();

    useEffect( () => {
        const fetchUser = async () => {
            try{
                const response = await getUser();
                setUser(response.data);
                //console.log("User profile picture data:", response.data.profilePicture);
            } catch(error){
                console.error("Failed to load user: ", error);
                //navigate("/login");
            }
        };

        fetchUser();
    },[]);

    const toggleSettings = () => setSettingsOpen(!settingsOpen);
    const toggleProfilePicture = () => setShowFullPic(!showFullPic);

    if(!user) return null;

    return (
        <header className="flex items-center w-screen justify-between px-4 py-2 shadow-md bg-white sticky top-0 z-50">
            {/*pfp*/}
            <div className="relative">
                <img
                    src={user.profilePicture?.url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer object-cover border"
                    onClick={toggleProfilePicture}
                />
                {showFullPic && (
                <div
                    className="fixed inset-0 bg-gray bg-opacity-70 flex flex-col items-center justify-center z-50"
                    onClick={toggleProfilePicture}
                >
                    <img
                    src={user.profilePicture?.url}
                    alt="Full Profile"
                    className="w-60 h-60 rounded-full border-4 border-white object-cover"
                    />
                    <div className="mt-4 space-x-4">
                    <button className="px-4 py-2 rounded bg-red-600 text-white">Remove</button>
                    <button className="px-4 py-2 rounded bg-blue-600 text-white">Update</button>
                    </div>
                </div>
                )}
            </div>
            {/*title*/}
            <h1 className="text-xl font-semibold text-center cursor-pointer"
             onClick={() => navigate("/home")} >
                AspireInfoLabs
            </h1>
            {/*settings*/}
            <FiSettings
                size={24}
                className="cursor-pointer"
                onClick={toggleSettings}
            />
            {settingsOpen && (
                <div className="absolute top-14 right-4 bg-white border rounded shadow-md p-2 z-50">
                <ul className="text-sm space-y-2">
                    <li className="cursor-pointer">Account</li>
                    <li className="cursor-pointer">Preferences</li>
                    <li
                    className="cursor-pointer text-red-500"
                    onClick={() => {
                        // clear token/cookies and redirect
                        navigate("/logout");
                    }}
                    >
                    Logout
                    </li>
                </ul>
                </div>
            )}
        </header>
    )
}

export {
    Header
}