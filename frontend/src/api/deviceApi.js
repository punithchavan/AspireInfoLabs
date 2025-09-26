import { API } from "./axios";

const getUserDevices = async () => {
    try{
        const response = await API.get("/devices", { withCredentials: true });
        return response.data; 
    } catch (error){
        console.error("Failed to fetch devices:", error);
        throw error;
    }
};

const removeDevice = async (sessionId) =>{
    try{
        const reponse = await API.delete(`/devices/${sessionId}`, { withCredentials:true});
        return response.data;
    } catch(error){
        console.error("Failed to remove device:", error);
        throw error;
    }
};

export {
    getUserDevices,
    removeDevice
}