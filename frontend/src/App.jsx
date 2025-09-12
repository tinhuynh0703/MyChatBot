import Chatbot from "./components/Chatbot";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Main content area - you can add your website content here */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Chào mừng đến với Support Chatbot
        </h1>
        <p className="text-gray-600 text-center mt-4">
          Tôi có thể giúp bạn tìm kiếm thông tin và hỗ trợ 24/7. Click vào nút
          chat để bắt đầu!
        </p>
      </div>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
}

export default App;
