'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🔄 Login denemesi:', formData);
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('📨 Response alındı:', {
        status: response.status,
        ok: response.ok,
        headers: response.headers
      });
      
      // Response'u text olarak al, sonra parse et
      const responseText = await response.text();
      console.log('📄 Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📦 Parsed data:', data);
      } catch (parseError) {
        console.error('❌ JSON parse hatası:', parseError);
        alert('Sunucudan geçersiz response geldi');
        return;
      }
      
      if (response.ok && data) {
        console.log('✅ Login başarılı!', data);
        
        if (data.token && data.user) {
          // Token'ı localStorage'a kaydet
          localStorage.setItem('token', data.token);
          localStorage.setItem('userRole', data.user.role);
          localStorage.setItem('userInfo', JSON.stringify(data.user));
          
          console.log('💾 LocalStorage\'a kaydedildi');
          console.log('🎯 Role:', data.user.role);
          
          // Role'e göre yönlendirme
          const userRole = data.user.role.toLowerCase();
          console.log('🚀 Yönlendiriliyor:', userRole);
          
          switch (userRole) {
            case 'admin':
              console.log('👑 Admin sayfasına gidiyor...');
              router.replace('/admin');
              break;
            case 'provider':
              console.log('🏢 Provider sayfasına gidiyor...');
              router.replace('/provider');
              break;
            case 'user':
            default:
              console.log('👤 Dashboard\'a gidiyor...');
              router.replace('/dashboard');
              break;
          }
        } else {
          console.error('❌ Token veya user bilgisi eksik:', data);
          alert('Giriş bilgileri eksik!');
        }
      } else {
        console.log('❌ Response başarısız:', response.status, data);
        alert(data?.message || 'Giriş başarısız!');
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      alert('Bağlantı hatası: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">EnerjiMetre</h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/signup" className="text-green-600 hover:text-green-500 font-medium">
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="text-green-600 hover:text-green-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
