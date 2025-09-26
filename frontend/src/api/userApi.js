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


export {
    registerUser,
    verifyEmail,
    completeProfile,
    loginUser,
    getUser
}