import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser  } from "../api/userApi";

const RegisterPage = () =>{
    const navigate = useNavigate();
    const [formData, setFormData] = useState({fullName: "", DOB: "", email: "",});
    const [loading, setLoading] = useState(false);

    const handleChange = async (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);

        try{
            const payload = {
                fullName : formData.fullName,
                DOB : formData.DOB,
                email : formData.email,
            };

            await registerUser(payload);
            navigate("/check-email");
        } catch(error){
            console.error(error);
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-4">AspireInfoLabs</h1>  
                <h2 className="text-2xl font-semibold mb-6 text-center">Create your account</h2>
                <input 
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none"
                  required
                />

                <input 
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none"
                  required
                />

                <input 
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  placeholder="Date of birth"
                  className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none"
                  required
                />

                <button type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >Next</button>
            </form>
        </div>
    );
}

export {
    RegisterPage
}