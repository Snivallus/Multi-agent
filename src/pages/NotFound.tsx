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

  const imageUrl = "https://github.com/Snivallus/Multi-agent/blob/main/public/man.jpg?raw=true";
  // 或使用 "/man.jpg" 作为图片路径
  // 测试时只需访问 http://localhost:8080/#/non-existent-path 即可看到效果
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <img
          src={imageUrl}
          alt="Man!"
          className="max-auto mb-8 w-64 h-64 object-contain"
        />
        <h1 className="text-2xl font-bold mb-4">Man! What can I say?</h1>
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