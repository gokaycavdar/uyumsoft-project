import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white font-display">EnerjiMetre</h1>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/login">
            <button className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-5xl font-bold text-gray-800 dark:text-white leading-tight">
              EV Charging Station & 
              <span className="text-green-500"> Bill Management</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Discover nearest charging stations, manage your charging bills, and optimize your electric vehicle experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Nearest charging stations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Bill management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Charging status tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Charging history</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative w-full h-96 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-3xl overflow-hidden">
              {/* Charging Station */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Charging Station Post */}
                  <div className="w-4 h-32 bg-gray-600 rounded-t-lg mx-auto"></div>
                  
                  {/* Charging Station Head */}
                  <div className="w-16 h-20 bg-white rounded-lg shadow-lg relative -mt-8">
                    {/* Screen */}
                    <div className="absolute top-2 left-2 right-2 h-8 bg-green-400 rounded animate-pulse"></div>
                    
                    {/* Charging Port */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gray-800 rounded"></div>
                  </div>
                  
                  {/* Electric Car */}
                  <div className="absolute -right-24 top-8">
                    <div className="w-20 h-12 bg-blue-500 rounded-xl shadow-lg relative transform hover:scale-105 transition-transform duration-300">
                      {/* Car Details */}
                      <div className="absolute top-1 left-2 w-6 h-4 bg-blue-300 rounded"></div>
                      <div className="absolute top-1 right-2 w-6 h-4 bg-blue-300 rounded"></div>
                      
                      {/* Wheels */}
                      <div className="absolute -bottom-2 left-2 w-4 h-4 bg-gray-800 rounded-full"></div>
                      <div className="absolute -bottom-2 right-2 w-4 h-4 bg-gray-800 rounded-full"></div>
                      
                      {/* Lightning Bolt on Car */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Charging Cable */}
                  <div className="absolute -right-16 top-12 w-8 h-1 bg-green-500 rounded-full"></div>
                  <div className="absolute -right-8 top-10 w-1 h-6 bg-green-500 rounded-full"></div>
                  
                  {/* Energy Flow Animation */}
                  <div className="absolute -right-20 top-6 flex space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-75"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-150"></div>
                  </div>
                </div>
              </div>
              
              {/* Floating Energy Icons */}
              <div className="absolute top-8 left-8">
                <svg className="w-8 h-8 text-yellow-300 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
              </div>
              
              <div className="absolute top-16 right-12">
                <svg className="w-6 h-6 text-green-300 animate-bounce delay-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd"/>
                </svg>
              </div>
              
              <div className="absolute bottom-12 left-12">
                <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse"></div>
              </div>
              
              <div className="absolute bottom-8 right-8">
                <div className="w-6 h-6 bg-purple-300 rounded-full animate-bounce delay-500"></div>
              </div>
              
              {/* Charging Progress Bar */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-white bg-opacity-30 rounded-full">
                <div className="h-full bg-green-400 rounded-full animate-pulse" style={{width: '75%'}}></div>
              </div>
              
              {/* Percentage Display */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg animate-pulse">
                75%
              </div>
            </div>
            
            {/* Orbiting Elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-spin origin-bottom" style={{animationDuration: '3s'}}></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full animate-spin origin-top" style={{animationDuration: '4s'}}></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-spin origin-right" style={{animationDuration: '5s'}}></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full animate-spin origin-left" style={{animationDuration: '6s'}}></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
