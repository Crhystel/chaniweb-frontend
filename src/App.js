import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [view, setView] = useState("landing");
  const [selectedProductGroup, setSelectedProductGroup] = useState(null);

  // Forzar rebuild - v2
  console.log("ChaniWeb v2.0 - Frontend actualizado");

  useEffect(() => {
    // Simulación de llamada a la API
    fetch("/api/productos")
      .then((r) => r.json())
      .then(setProducts)
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  // Función de Categorización basada en la lista de productos de Python
  const getCategory = (name) => {
    const n = name.toLowerCase();
    if (
      n.includes("arroz") ||
      n.includes("lenteja") ||
      n.includes("garbanzo") ||
      n.includes("fréjol") ||
      n.includes("habas") ||
      n.includes("quinua")
    )
      return "Granos";
    if (
      n.includes("leche") ||
      n.includes("yogurt") ||
      n.includes("mantequilla") ||
      n.includes("margarina")
    )
      return "Lácteos";
    if (
      n.includes("pollo") ||
      n.includes("carne") ||
      n.includes("jamón") ||
      n.includes("cerdo") ||
      n.includes("camarón") ||
      n.includes("huevo") ||
      n.includes("tocino")
    )
      return "Proteínas";
    if (n.includes("atún") || n.includes("sardina")) return "Enlatados";
    if (
      n.includes("aceite") ||
      n.includes("vinagre") ||
      n.includes("comino") ||
      n.includes("pimienta") ||
      n.includes("ajo") ||
      n.includes("cubitos") ||
      n.includes("azúcar") ||
      n.includes("panela") ||
      n.includes("miel")
    )
      return "Despensa";
    if (
      n.includes("fideo") ||
      n.includes("spaghetti") ||
      n.includes("tallarín") ||
      n.includes("macarrones") ||
      n.includes("lasagna") ||
      n.includes("ramen")
    )
      return "Pastas";
    if (
      n.includes("pan") ||
      n.includes("galleta") ||
      n.includes("tortilla") ||
      n.includes("maicena") ||
      n.includes("cocoa") ||
      n.includes("tapioca") ||
      n.includes("harina")
    )
      return "Panadería";
    if (n.includes("café") || n.includes("coca")) return "Bebidas";
    return "Otros";
  };

  const categories = [
    "Todos",
    "Granos",
    "Lácteos",
    "Proteínas",
    "Enlatados",
    "Despensa",
    "Pastas",
    "Panadería",
    "Bebidas",
  ];

  // Lógica de filtrado
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const productCat = getCategory(p.name);
    const matchesCategory =
      selectedCategory === "Todos" || productCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Agrupación por nombre de producto para la comparativa
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.name]) acc[product.name] = [];
    acc[product.name].push(product);
    return acc;
  }, {});

  const getBestPrice = (list) =>
    list.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));

  // --- RENDER VISTA LANDING ---
  if (view === "landing") {
    return (
      <div className="landing-wrapper">
        <nav className="glass-nav">
          <div className="logo">
            Chani<span>Web</span>
          </div>
        </nav>

        <div className="hero-container">
          <div className="hero-text">
            <h1 className="main-title">
              Compara. <br />
              <span className="text-gradient">Ahorra.</span> <br />
              Sonríe.
            </h1>
            <p className="hero-p">
              La plataforma inteligente para encontrar los mejores precios en
              Supermaxi, Akí y Mi Comisariato en tiempo real.
            </p>
            <button className="cta-button" onClick={() => setView("search")}>
              Empezar a ahorrar
              <span className="arrow">→</span>
            </button>
          </div>
          <div className="hero-visual">
            <div className="floating-blob"></div>
            <div className="price-card-preview">
              <div className="preview-item">
                Arroz Diana <span>$1.18</span>
              </div>
              <div className="preview-item">
                Leche Toni <span>$1.00</span>
              </div>
              <div className="preview-item">
                Atún Real <span>$1.45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER VISTA BUSCADOR ---
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => setView("landing")}>
          Chani<span>Web</span>
        </div>

        <nav className="cat-nav">
          <p className="nav-label">Categorías</p>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-link ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <button className="back-home-btn" onClick={() => setView("landing")}>
          🏠 Volver al Inicio
        </button>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="search-bar-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="¿Qué producto buscas hoy?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="main-search-input"
            />
          </div>
        </header>

        <div className="results-wrapper">
          <div className="results-meta">
            <h2>
              {selectedCategory === "Todos"
                ? "Todos los productos"
                : selectedCategory}
            </h2>
            <span>
              {Object.keys(groupedProducts).length} marcas encontradas
            </span>
          </div>

          <div className="products-grid">
            {Object.entries(groupedProducts).map(([name, list]) => {
              const best = getBestPrice(list);
              return (
                <div
                  key={`group-${name}`}
                  className="product-card-modern"
                  onClick={() => {
                    setSelectedProductGroup(list);
                    setView("detail");
                  }}
                >
                  <div className="product-badge">
                    Mejor precio: {best.source}
                  </div>
                  <div className="product-body">
                    <div className="product-img-box">
                      <img
                        src={best.image_url}
                        alt={name}
                        referrerPolicy="no-referrer"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/100?text=🛒")
                        }
                      />
                    </div>
                    <div className="product-info-text">
                      <h3>{name}</h3>
                      <p>{list.length} opciones disponibles</p>
                    </div>
                    <div className="product-price-tag">
                      <span className="dollar">$</span>
                      {best.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- MODAL DE DETALLE */}
        {view === "detail" && selectedProductGroup && (
          <div className="modal-overlay" onClick={() => setView("search")}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setView("search")}>
                ✕
              </button>

              <div className="modal-header-detail">
                <div className="modal-img-container">
                  <img
                    src={selectedProductGroup[0].image_url}
                    alt={selectedProductGroup[0].name}
                  />
                </div>
                <div className="modal-text-container">
                  <span className="modal-tag">
                    {getCategory(selectedProductGroup[0].name)}
                  </span>
                  <h2>{selectedProductGroup[0].name}</h2>
                  <p className="modal-subtitle">
                    Comparativa de precios actualizados
                  </p>
                </div>
              </div>

              <div className="comparison-list">
                <p className="list-title">Precios por establecimiento:</p>
                {selectedProductGroup
                  .sort((a, b) => a.price - b.price)
                  .map((p, i) => (
                    <div
                      key={i}
                      className={`comparison-item ${i === 0 ? "winner" : ""}`}
                    >
                      <div className="store-info">
                        <span className="store-name">{p.source}</span>
                        <span className="item-qty">
                          Envase: {p.quantity}
                          {p.unit}
                        </span>
                      </div>
                      <div className="price-info">
                        <span className="item-price">
                          ${p.price.toFixed(2)}
                        </span>
                        {i === 0 && (
                          <span className="winner-label">EL MÁS BARATO ✅</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
