import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi"

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setformData] = useState({emailOrUsername: "", password: ""});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>{
        setformData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try{
            const payload = {
                email: formData.emailOrUsername.includes("@") ? formData.emailOrUsername : undefined,
                username: !formData.emailOrUsername.includes("@") ? formData.emailOrUsername : undefined,
                password: formData.password,
            };

            await loginUser(payload);
            navigate("/home");
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">newsX</h1>  
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <input
          type="text"
          name="emailOrUsername"
          value={formData.emailOrUsername}
          onChange={handleChange}
          placeholder="Email or Username"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-center">
          Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </form>
    </div>
    );
};

export {
    LoginPage
}