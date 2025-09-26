import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/userApi";

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Verifying your mail...");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if(!token){
            setMessage("Invalid verification link");
            setLoading(false);
            return;
        }

        const verify = async () => {
            try{
                await verifyEmail({ token });
                setMessage("Email verified successfull! Complete your profile!");
                setTimeout(() => navigate("/complete-profile"), 2000);
            } catch(error){
                setMessage("Verification failed. The link may be invalid or expired.");
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [searchParams, navigate]);

    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
        <p className="text-gray-600">{message}</p>
        {loading && <p className="text-sm text-gray-400 mt-2">Please wait...</p>}
      </div>
    </div>
  );
}

export{
    VerifyEmailPage
}