const CheckEmailPage = ()=>{
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 ">
             <div className="bh-white shadow-md rounded-xl p-8 w-full max-w-md text-center ">
                <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
                <p className="text-gray-600">
                    We've sent a verification link to your email. Please check your inbox
                    and click the link to activate your account.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                    Didn't receive an email? Check your spam folder or try registering again.
                </p>
             </div>
        </div>
    )
}

export {
    CheckEmailPage
}