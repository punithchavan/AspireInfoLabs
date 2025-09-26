import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../api/userApi";

const CompleteProfilePage = () =>{
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        bio: "",
        profilePicture: null,
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>{
        const { name, value, files } = e.target;

        if(name === "profilePicture"){
            setFormData((prev) => ({
                ...prev,
                profilePicture: files[0],
            }));
        } else{
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        const data = new FormData();
        data.append("username", formData.username);
        data.append("password", formData.password);
        data.append("bio", formData.bio);
        data.append("profilePicture", formData.profilePicture);

        try {
            const response = await completeProfile(data);
            //console.log("✅ Backend Response:", response?.data);
            navigate("/home");
        } catch (error) {
            const err = error?.response?.data?.message || "Something went wrong";
            setErrorMessage(err);
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Complete Your Profile
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-md"
        />

        <input
          type="password"
          name="password"
          placeholder="Set Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-md"
        />

        <textarea
          name="bio"
          placeholder="Your bio..."
          value={formData.bio}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-md"
        />

        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full mb-6"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Submitting..." : "Finish Setup"}
        </button>
      </form>
    </div>
    )
}

export{
    CompleteProfilePage
}