import { API } from "./axios";

const registerUser = async (formData) => {
    try {
        const response = await API.post("/users/register", formData);
        return response.data;
    } catch (error) {
        console.log(error);
        alert(error?.response?.data?.message || "Registration failed");
    }
}

const verifyEmail = async ({ token }) => {
    const response = await API.post("/users/verify-email", { token });
    return response.data;
}

const completeProfile = async (formData) => {
  const response = await API.post(
    "/users/complete-profile",
    formData,
    {
      withCredentials: true, 
    }
  );
  return response.data;
};

const loginUser = async (formData) =>{
    const response = await API.post("/users/login", formData);
    return response.data;
}

const getUser = async () => {
  const response = await API.get("/users/me", {
    withCredentials: true,
  });
  return response.data;
};

const enable2FA = async () =>{
    const response = await API.post("/users/2fa/enable", {}, { withCredentials: true});
    return response
}

const verify2FA = async (token) => {
    const response = await API.post("/users/2fa/verify", { token }, { withCredentials: true });
    return response.data;
}

const loginWith2FA = async ({ userId, token }) =>{
    const response = await API.post("users/login-2fa", { userId, token }, { withCredentials: true });
    return response.data;
}

export {
    registerUser,
    verifyEmail,
    completeProfile,
    loginUser,
    getUser,
    enable2FA,
    verify2FA,
    loginWith2FA
}