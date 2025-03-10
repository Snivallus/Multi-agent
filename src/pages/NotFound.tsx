import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const imageUrl = "/piblic/man.jpg";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <img
          src={imageUrl}
          alt="Man!"
          className="max-auto mb-8 w-64 h-64 object-contain animate-bounce"
        />
        <h1 className="text-4xl font-bold mb-4">024</h1>
        <p className="text-xl text-gray-600 mb-4">Man! What can I say?</p>
        <a 
          href="/" 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;