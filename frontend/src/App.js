import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [diagnosticForm, setDiagnosticForm] = useState({
    problem_description: ''
  });
  
  const [priceForm, setPriceForm] = useState({
    brand: '',
    model: '',
    problem: ''
  });
  
  const [requestForm, setRequestForm] = useState({
    name: '',
    contact: '',
    device_brand: '',
    device_model: '',
    problem_description: '',
    estimated_price: ''
  });

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Oppo', 'Vivo', 'Другие'];

  // Handle diagnostic
  const handleDiagnostic = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/diagnostic`, diagnosticForm);
      setDiagnosticResult(response.data);
    } catch (error) {
      console.error('Diagnostic error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle price estimation
  const handlePriceEstimate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/price-estimate`, priceForm);
      setPriceEstimate(response.data);
    } catch (error) {
      console.error('Price estimate error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle repair request
  const handleRepairRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/repair-request`, requestForm);
      alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
      setRequestForm({
        name: '',
        contact: '',
        device_brand: '',
        device_model: '',
        problem_description: '',
        estimated_price: ''
      });
    } catch (error) {
      console.error('Repair request error:', error);
      alert('Ошибка при отправке заявки. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handler
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setCurrentSection(sectionId);
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-900">FixNet</div>
            <div className="hidden md:flex space-x-6">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-blue-600">Главная</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-blue-600">О нас</button>
              <button onClick={() => scrollToSection('assistant')} className="text-gray-700 hover:text-blue-600">Помощник</button>
              <button onClick={() => scrollToSection('calculator')} className="text-gray-700 hover:text-blue-600">Калькулятор</button>
              <button onClick={() => scrollToSection('request')} className="text-gray-700 hover:text-blue-600">Заявка</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-overlay">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                FixNet — федеральная сеть сервисных центров
              </h1>
              <p className="text-xl md:text-2xl mb-4 animate-fade-in-delay">
                Доверие. Прозрачность. Качество.
              </p>
              <p className="text-lg mb-8 animate-fade-in-delay-2">
                Когда важно, чтобы работало.
              </p>
              <button 
                onClick={() => scrollToSection('request')}
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 animate-fade-in-delay-3"
              >
                Оформить заявку на ремонт
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">О нас</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              FixNet — будущий лидер рынка по ремонту мобильной техники. 
              Наша миссия — сделать ремонт прозрачным и честным.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-4">Стандарты качества</h3>
              <p className="text-gray-600">Единые стандарты обслуживания во всех сервисных центрах федеральной сети</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-4">Гарантия на каждый ремонт</h3>
              <p className="text-gray-600">Официальная гарантия на все виды ремонтных работ с прозрачными условиями</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-4">Умный онлайн-помощник</h3>
              <p className="text-gray-600">ИИ-диагностика проблем и предварительная оценка стоимости ремонта</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-4">Удобно везде</h3>
              <p className="text-gray-600">Telegram, сайт, приложение — оформляйте заявки удобным способом</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-4">Франчайзинговая модель</h3>
              <p className="text-gray-600">Масштабируемая бизнес-модель для развития федеральной сети</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-4">Прозрачность</h3>
              <p className="text-gray-600">Честные цены, подробные отчеты о проделанной работе</p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-blue-600 hover:text-blue-800 text-2xl">📧</a>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-2xl">📱</a>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-2xl">📷</a>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section id="assistant" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">Онлайн помощник</h2>
            <p className="text-xl text-gray-700">
              Опишите вашу проблему, мы поможем определить неисправность
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleDiagnostic} className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Опишите проблему с устройством:
                </label>
                <textarea
                  value={diagnosticForm.problem_description}
                  onChange={(e) => setDiagnosticForm({...diagnosticForm, problem_description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="4"
                  placeholder="Например: экран треснул, быстро разряжается батарея, не работает звук..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Анализируем...' : 'Получить диагностику'}
              </button>
            </form>
            
            {diagnosticResult && (
              <div className="mt-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Результат диагностики: {diagnosticResult.category}
                </h3>
                <p className="text-gray-700 mb-4">{diagnosticResult.description}</p>
                <p className="text-blue-800 font-medium">{diagnosticResult.recommendation}</p>
                <button
                  onClick={() => scrollToSection('request')}
                  className="mt-4 bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Оформить заявку
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Price Calculator Section */}
      <section id="calculator" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">Рассчитать ремонт</h2>
            <p className="text-xl text-gray-700">
              Узнайте ориентировочную стоимость ремонта вашего устройства
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handlePriceEstimate} className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Производитель:
                  </label>
                  <select
                    value={priceForm.brand}
                    onChange={(e) => setPriceForm({...priceForm, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Выберите производителя</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Модель:
                  </label>
                  <input
                    type="text"
                    value={priceForm.model}
                    onChange={(e) => setPriceForm({...priceForm, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Например: iPhone 14, Galaxy S23"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Проблема:
                </label>
                <input
                  type="text"
                  value={priceForm.problem}
                  onChange={(e) => setPriceForm({...priceForm, problem: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Например: замена экрана, замена батареи"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Рассчитываем...' : 'Рассчитать стоимость'}
              </button>
            </form>
            
            {priceEstimate && (
              <div className="mt-8 bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Ориентировочная стоимость: {priceEstimate.estimated_price}
                </h3>
                <p className="text-gray-700 mb-4">{priceEstimate.description}</p>
                <button
                  onClick={() => {
                    setRequestForm({
                      ...requestForm,
                      device_brand: priceForm.brand,
                      device_model: priceForm.model,
                      problem_description: priceForm.problem,
                      estimated_price: priceEstimate.estimated_price
                    });
                    scrollToSection('request');
                  }}
                  className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Оформить заявку
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Repair Request Section */}
      <section id="request" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">Оформить заявку</h2>
            <p className="text-xl text-gray-700">
              Заполните форму, и мы свяжемся с вами в ближайшее время
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleRepairRequest} className="bg-gray-50 p-8 rounded-lg shadow-lg">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ваше имя:
                  </label>
                  <input
                    type="text"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Телефон/Email:
                  </label>
                  <input
                    type="text"
                    value={requestForm.contact}
                    onChange={(e) => setRequestForm({...requestForm, contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="+7 (999) 123-45-67 или email@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Бренд устройства:
                  </label>
                  <select
                    value={requestForm.device_brand}
                    onChange={(e) => setRequestForm({...requestForm, device_brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Выберите бренд</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Модель:
                  </label>
                  <input
                    type="text"
                    value={requestForm.device_model}
                    onChange={(e) => setRequestForm({...requestForm, device_model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Например: iPhone 14 Pro"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Описание проблемы:
                </label>
                <textarea
                  value={requestForm.problem_description}
                  onChange={(e) => setRequestForm({...requestForm, problem_description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="4"
                  placeholder="Подробно опишите проблему с устройством..."
                  required
                />
              </div>
              
              {requestForm.estimated_price && (
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ориентировочная стоимость:
                  </label>
                  <input
                    type="text"
                    value={requestForm.estimated_price}
                    onChange={(e) => setRequestForm({...requestForm, estimated_price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Отправляем заявку...' : 'Отправить заявку'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4">FixNet</div>
            <p className="text-blue-200 mb-6">Когда важно, чтобы работало.</p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-blue-300 hover:text-white">📧 Email</a>
              <a href="#" className="text-blue-300 hover:text-white">📱 Telegram</a>
              <a href="#" className="text-blue-300 hover:text-white">📷 Instagram</a>
            </div>
            <p className="text-blue-300 text-sm">
              © 2024 FixNet. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;