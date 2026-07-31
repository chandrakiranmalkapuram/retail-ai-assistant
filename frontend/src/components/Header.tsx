const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">

          {/* Logo & Icon Section */}
          <div className="flex items-center gap-3">

            {/* Shopping Bag Icon (SVG) */}
            <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">
                Retail AI Assistant
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Find products, track orders, and get instant help
              </p>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
