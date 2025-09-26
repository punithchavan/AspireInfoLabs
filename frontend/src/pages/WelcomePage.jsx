import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to AspireInfoLabs</h1>
        <p className="text-lg mb-6">
          A modern, secure platform. 
        </p>
        <p className="text-md text-gray-600 mb-8">
          Built as a part of hackathon, test how secure the app is.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-full transition duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export{
    WelcomePage
}
