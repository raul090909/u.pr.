// App.jsx
import { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import './App.css'


// Создаем контексты для темы и корзины
const ThemeContext = createContext()
const CartContext = createContext()

// Провайдер темы
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Провайдер корзины
function CartProvider({ children }) {
  const [cart, setCart] = useState({})

  const addToCart = (gameName, quantity) => {
    setCart(prevCart => ({
      ...prevCart,
      [gameName]: quantity
    }))
  }

  const removeFromCart = (gameName) => {
    setCart(prevCart => {
      const newCart = { ...prevCart }
      delete newCart[gameName]
      return newCart
    })
  }

  const clearCart = () => {
    setCart({})
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  const getTotalPrice = (games) => {
    return games.reduce((total, game) => {
      const quantity = cart[game.name] || 0
      return total + (game.price * quantity)
    }, 0)
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      getTotalItems, 
      getTotalPrice 
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Хуки для использования контекстов
const useTheme = () => useContext(ThemeContext)
const useCart = () => useContext(CartContext)

// Компонент карточки игры (квадратик)
function BoardGameCard({ game }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(0)

  const handleAddToCart = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    addToCart(game.name, newQuantity)
  }

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      addToCart(game.name, newQuantity)
    }
  }

  const handleIncrease = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    addToCart(game.name, newQuantity)
  }

  const handleViewCart = () => {
    navigate('/cart')
  }

  // Иконки для разных типов игр
  const getGameIcon = (category) => {
    const icons = {
      'family': '👨‍👩‍👧‍👦',
      'strategy': '♟️',
      'adventure': '🗺️',
      'rpg': '⚔️'
    }
    return icons[category] || '🎲'
  }

  // Цвета для карточек
  const getGameColor = (category) => {
    const colors = {
      'family': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'strategy': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'adventure': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'rpg': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
    return colors[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }

  return (
    <div className="game-card-square">
      <div 
        className="game-header-square"
        style={{ background: getGameColor(game.category) }}
      >
        <div className="game-icon-square">{getGameIcon(game.category)}</div>
        <div className="game-badge-square">{game.age}+</div>
      </div>
      
      <div className="game-content-square">
        <h3 className="game-name-square">{game.name}</h3>
        
        <div className="game-stats-square">
          <div className="stat-square">
            <span className="stat-icon-square">👥</span>
            <span className="stat-value-square">{game.players}</span>
          </div>
          <div className="stat-square">
            <span className="stat-icon-square">⏱</span>
            <span className="stat-value-square">{game.duration}</span>
          </div>
        </div>
        
        <div className="price-section-square">
          <span className="game-price-square">{game.price.toLocaleString()} ₽</span>
        </div>
        
        {quantity === 0 ? (
          <button 
            className="add-to-cart-btn-square"
            onClick={handleAddToCart}
            style={{ background: getGameColor(game.category) }}
          >
            <span>В корзину</span>
            <span className="cart-icon-square">🛒</span>
          </button>
        ) : (
          <div className="counter-container-square">
            <button className="counter-btn-square" onClick={handleDecrease}>
              −
            </button>
            <span className="quantity-square">{quantity}</span>
            <button className="counter-btn-square" onClick={handleIncrease}>
              +
            </button>
            <button 
              className="view-cart-btn-square" 
              onClick={handleViewCart}
              title="Перейти в корзину"
            >
              🛒
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Компонент корзины
function CartPage() {
  const { cart, removeFromCart, clearCart, getTotalPrice } = useCart()
  const navigate = useNavigate()

  const boardGames = [
    {
      id: 1,
      name: "Каркассон",
      price: 2990,
    },
    {
      id: 2,
      name: "Колонизаторы",
      price: 4590,
    },
    {
      id: 3,
      name: "Манчкин",
      price: 1890,
    },
    {
      id: 4,
      name: "Эпичные схватки",
      price: 3490,
    },
    {
      id: 5,
      name: "Диксит",
      price: 2790,
    },
    {
      id: 6,
      name: "Подземелья и драконы",
      price: 5890,
    }
  ]

  const cartItems = boardGames.filter(game => cart[game.name] > 0)
  const totalPrice = getTotalPrice(boardGames)
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  if (cartItems.length === 0) {
    return (
      <div className="no-games">
        <div className="no-games-icon">🛒</div>
        <h3>Корзина пуста</h3>
        <p>Добавьте товары из каталога</p>
        <button 
          className="add-to-cart-btn-square"
          onClick={() => navigate('/')}
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            marginTop: '20px',
            maxWidth: '200px'
          }}
        >
          Вернуться к покупкам
        </button>
      </div>
    )
  }

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h2>Корзина покупок</h2>
        <div className="cart-summary">
          <span className="cart-items-count">{totalItems} товаров</span>
          <span className="cart-total-price">{totalPrice.toLocaleString()} ₽</span>
        </div>
      </div>
      
      <div className="cart-items-grid">
        {cartItems.map(game => (
          <div key={game.id} className="cart-item-card">
            <div className="cart-item-header">
              <h3>{game.name}</h3>
              <span className="item-price">{game.price.toLocaleString()} ₽</span>
            </div>
            <div className="cart-item-details">
              <span>Количество: {cart[game.name]}</span>
              <span className="item-total">Сумма: {(game.price * cart[game.name]).toLocaleString()} ₽</span>
            </div>
            <button 
              className="remove-btn"
              onClick={() => removeFromCart(game.name)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-actions">
        <button className="clear-cart-btn" onClick={clearCart}>
          Очистить корзину
        </button>
        <button className="continue-shopping-btn" onClick={() => navigate('/')}>
          Продолжить покупки
        </button>
        <button 
          className="checkout-btn"
          onClick={() => alert(`Заказ оформлен! Сумма: ${totalPrice.toLocaleString()} ₽`)}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  )
}

// Компонент входа
function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoggedIn(true)
    setTimeout(() => navigate('/dashboard'), 1000)
  }

  if (isLoggedIn) {
    return (
      <div className="no-games">
        <div className="no-games-icon">✅</div>
        <h3>Вход выполнен успешно!</h3>
        <p>Перенаправление на dashboard...</p>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Вход в систему</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" required />
          </div>
          <div className="form-group">
            <label>Пароль:</label>
            <input type="password" required />
          </div>
          <button type="submit" className="login-btn">Войти</button>
        </form>
      </div>
    </div>
  )
}

// Компонент dashboard
function DashboardPage() {
  const { cart, getTotalItems, getTotalPrice } = useCart()

  const boardGames = [
    { id: 1, name: "Каркассон", price: 2990 },
    { id: 2, name: "Колонизаторы", price: 4590 },
    { id: 3, name: "Манчкин", price: 1890 },
    { id: 4, name: "Эпичные схватки", price: 3490 },
    { id: 5, name: "Диксит", price: 2790 },
    { id: 6, name: "Подземелья и драконы", price: 5890 }
  ]

  const totalPrice = getTotalPrice(boardGames)
  const totalItems = getTotalItems()

  return (
    <div className="dashboard-container">
      <h2>Панель управления</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Товаров в корзине</h3>
          <span className="stat-number">{totalItems}</span>
        </div>
        <div className="stat-card">
          <h3>Общая сумма</h3>
          <span className="stat-number">{totalPrice.toLocaleString()} ₽</span>
        </div>
        <div className="stat-card">
          <h3>Избранные товары</h3>
          <span className="stat-number">{Object.keys(cart).length}</span>
        </div>
      </div>
    </div>
  )
}

// Главный компонент приложения
function AppContent() {
  const [filter, setFilter] = useState('all')
  const { theme, toggleTheme } = useTheme()
  const { getTotalItems, getTotalPrice } = useCart()

  const boardGames = [
    {
      id: 1,
      name: "Каркассон",
      price: 2990,
      players: "2-5",
      age: 8,
      duration: "30-45 мин",
      category: "family"
    },
    {
      id: 2,
      name: "Колонизаторы",
      price: 4590,
      players: "3-4",
      age: 10,
      duration: "60-90 мин",
      category: "strategy"
    },
    {
      id: 3,
      name: "Манчкин",
      price: 1890,
      players: "3-6",
      age: 12,
      duration: "60-120 мин",
      category: "adventure"
    },
    {
      id: 4,
      name: "Эпичные схватки",
      price: 3490,
      players: "2",
      age: 14,
      duration: "45-60 мин",
      category: "strategy"
    },
    {
      id: 5,
      name: "Диксит",
      price: 2790,
      players: "3-6",
      age: 8,
      duration: "30 мин",
      category: "family"
    },
    {
      id: 6,
      name: "Подземелья и драконы",
      price: 5890,
      players: "4-6",
      age: 12,
      duration: "120+ мин",
      category: "rpg"
    }
  ]

  const filteredGames = filter === 'all' 
    ? boardGames 
    : boardGames.filter(game => game.category === filter)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-main">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <h1>BoardGame Store</h1>
          </div>
          
          <nav className="main-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              🎮 Каталог
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              🛒 Корзина
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              🔐 Вход
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              📊 Dashboard
            </NavLink>
          </nav>

          <div className="header-controls">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="cart-info">
              <div className="cart-icon">🛒</div>
              <div className="cart-details">
                <span className="cart-items">{getTotalItems()} товаров</span>
                <span className="cart-price">{getTotalPrice(boardGames).toLocaleString()} ₽</span>
              </div>
            </div>
          </div>
        </div>
        
        <Routes>
          <Route path="/" element={
            <>
              <nav className="filter-nav">
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
                  onClick={() => setFilter('all')}
                >
                  <span>🎲 Все игры</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'family' ? 'active' : ''}`} 
                  onClick={() => setFilter('family')}
                >
                  <span>👨‍👩‍👧‍👦 Семейные</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'strategy' ? 'active' : ''}`} 
                  onClick={() => setFilter('strategy')}
                >
                  <span>♟️ Стратегии</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'adventure' ? 'active' : ''}`} 
                  onClick={() => setFilter('adventure')}
                >
                  <span>🗺️ Приключения</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'rpg' ? 'active' : ''}`} 
                  onClick={() => setFilter('rpg')}
                >
                  <span>⚔️ Ролевые</span>
                </button>
              </nav>
            </>
          } />
        </Routes>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <div className="games-grid-square">
              {filteredGames.map(game => (
                <BoardGameCard key={game.id} game={game} />
              ))}
              
              {filteredGames.length === 0 && (
                <div className="no-games">
                  <div className="no-games-icon">😔</div>
                  <h3>Игры не найдены</h3>
                  <p>Попробуйте выбрать другую категорию</p>
                </div>
              )}
            </div>
          } />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ThemeProvider>ы
    </Router>
  )
}

export default App