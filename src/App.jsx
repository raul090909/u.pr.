import { useState } from 'react'
import './App.css'

function BoardGameCard({ name, price, players, age, duration, onAddToCart }) {
  const [quantity, setQuantity] = useState(0)

  const handleAddToCart = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    onAddToCart(name, newQuantity)
  }

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onAddToCart(name, newQuantity)
    }
  }

  const handleIncrease = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    onAddToCart(name, newQuantity)
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

  const category = boardGames.find(game => game.name === name)?.category || 'family'

  return (
    <div className="game-card">
      <div 
        className="game-header"
        style={{ background: getGameColor(category) }}
      >
        <div className="game-icon">{getGameIcon(category)}</div>
        <div className="game-badge">{age}+</div>
      </div>
      
      <div className="game-content">
        <h3 className="game-name">{name}</h3>
        
        <div className="game-stats">
          <div className="stat">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{players}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⏱</span>
            <span className="stat-value">{duration}</span>
          </div>
        </div>
        
        <div className="price-section">
          <span className="game-price">{price.toLocaleString()} ₽</span>
          <span className="price-label">цена</span>
        </div>
        
        {quantity === 0 ? (
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            style={{ background: getGameColor(category) }}
          >
            <span>В корзину</span>
            <span className="cart-icon">🛒</span>
          </button>
        ) : (
          <div className="counter-container">
            <button className="counter-btn" onClick={handleDecrease}>
              −
            </button>
            <span className="quantity">{quantity} в корзине</span>
            <button className="counter-btn" onClick={handleIncrease}>
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [cart, setCart] = useState({})
  const [filter, setFilter] = useState('all')

  const handleAddToCart = (gameName, quantity) => {
    setCart(prevCart => ({
      ...prevCart,
      [gameName]: quantity
    }))
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  const boardGames = [
    {
      id: 1,
      name: "Каркассон",
      price: 2990,
      players: "2-5 игроков",
      age: 8,
      duration: "30-45 мин",
      category: "family"
    },
    {
      id: 2,
      name: "Колонизаторы",
      price: 4590,
      players: "3-4 игрока",
      age: 10,
      duration: "60-90 мин",
      category: "strategy"
    },
    {
      id: 3,
      name: "Манчкин",
      price: 1890,
      players: "3-6 игроков",
      age: 12,
      duration: "60-120 мин",
      category: "adventure"
    },
    {
      id: 4,
      name: "Эпичные схватки",
      price: 3490,
      players: "2 игрока",
      age: 14,
      duration: "45-60 мин",
      category: "strategy"
    },
    {
      id: 5,
      name: "Диксит",
      price: 2790,
      players: "3-6 игроков",
      age: 8,
      duration: "30 мин",
      category: "family"
    },
    {
      id: 6,
      name: "Подземелья и драконы",
      price: 5890,
      players: "4-6 игроков",
      age: 12,
      duration: "120+ мин",
      category: "rpg"
    }
  ]

  const filteredGames = filter === 'all' 
    ? boardGames 
    : boardGames.filter(game => game.category === filter)

  const getTotalPrice = () => {
    return boardGames.reduce((total, game) => {
      const quantity = cart[game.name] || 0
      return total + (game.price * quantity)
    }, 0)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-main">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <h1>BoardGame Store</h1>
          </div>
          <div className="cart-info">
            <div className="cart-icon">🛒</div>
            <div className="cart-details">
              <span className="cart-items">{getTotalItems()} товаров</span>
              <span className="cart-price">{getTotalPrice().toLocaleString()} ₽</span>
            </div>
          </div>
        </div>
        
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
      </header>

      <main className="main-content">
        <div className="games-grid">
          {filteredGames.map(game => (
            <BoardGameCard
              key={game.id}
              name={game.name}
              price={game.price}
              players={game.players}
              age={game.age}
              duration={game.duration}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="no-games">
            <div className="no-games-icon">😔</div>
            <h3>Игры не найдены</h3>
            <p>Попробуйте выбрать другую категорию</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App