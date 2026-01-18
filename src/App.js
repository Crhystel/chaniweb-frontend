import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${API_BASE}/productos`)
      .then((r) => r.json())
      .then(setData);
  }, [API_BASE]);

  // Agrupar productos por nombre y encontrar el mejor precio
  const groupedProducts = data.reduce((acc, product) => {
    if (!acc[product.name]) {
      acc[product.name] = [];
    }
    acc[product.name].push(product);
    return acc;
  }, {});

  // Encontrar el mejor precio para cada producto
  const getBestPrice = (products) => {
    return Math.min(...products.map(p => p.standard_price));
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <h1>🛒 ChaniWeb - Comparador Sprint 1</h1>
      
      {Object.entries(groupedProducts).map(([productName, products]) => {
        const bestPrice = getBestPrice(products);
        
        return (
          <div key={productName} style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#2c3e50", marginBottom: "15px" }}>
              {productName}
            </h2>
            <table
              border="0"
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <thead style={{ backgroundColor: "#2c3e50", color: "white" }}>
                <tr>
                  <th style={{ padding: "15px" }}>Fuente</th>
                  <th>Precio Venta</th>
                  <th>Precio Normalizado (kg/L)</th>
                  <th>Mejor Precio</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isBestPrice = p.standard_price === bestPrice;
                  
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: "1px solid #eee",
                        textAlign: "center",
                        backgroundColor: isBestPrice ? "#d4edda" : "white"
                      }}
                    >
                      <td style={{ padding: "15px" }}>
                        <strong>{p.source}</strong>
                      </td>
                      <td>
                        ${p.price.toFixed(2)} / {p.quantity}
                        {p.unit}
                      </td>
                      <td style={{ 
                        fontWeight: "bold",
                        color: isBestPrice ? "#155724" : "#27ae60"
                      }}>
                        ${p.standard_price.toFixed(2)}
                      </td>
                      <td style={{ padding: "15px" }}>
                        {isBestPrice && (
                          <span style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "15px",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}>
                            ✅ MEJOR PRECIO
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default App;
