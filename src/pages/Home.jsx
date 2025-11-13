import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/style.css"; // Certifique-se que existe
import places from "../Data/places.json";
import events from "../Data/events.json";

export default function Mapa() {
  const mapRef = useRef(null);
  const [onlyRegistered, setOnlyRegistered] = useState(true);
  const [category, setCategory] = useState("Todos");

  // Função para escapar HTML
  const escapeHtml = (text) => {
    if (text == null) return "";
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  const formatDate = (d) => {
    const date = new Date(d);
    if (isNaN(date)) return d;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  // Filtra os lugares de acordo com o estado
  const filteredPlaces = places.filter((p) => {
    if (onlyRegistered && !p.isRegistered) return false;
    if (category !== "Todos" && p.categoria !== category) return false;
    return true;
  });

  useEffect(() => {
    // Configurar ícones padrão do Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    });

    // Inicializar o mapa
    const cityCenter = [-20.783853248053916, -51.711072149175365];
    const map = L.map(mapRef.current).setView(cityCenter, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    // Adicionar marcadores
    filteredPlaces.forEach((p) => {
      const marker = L.marker([p.latitude, p.longitude]);
      const verifiedText = p.isRegistered ? "Cadastur" : "Não verificado";
      const popupHtml = `
        <div style="min-width:200px">
          <strong>${escapeHtml(p.nome)}</strong>
          <div style="font-size:12px;color:#6b7280">${escapeHtml(
        p.categoria
      )} • ${verifiedText}</div>
          <p style="margin-top:8px;font-size:13px;color:#111827">${escapeHtml(
        p.descricao
      )}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            <div style="font-weight:600">${p.rating} ★</div>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      markersLayer.addLayer(marker);
    });

    return () => {
      map.remove(); // Limpa o mapa ao desmontar
    };
  }, [filteredPlaces]);

  // Destaques (top 3 registrados)
  const highlights = places.filter((p) => p.isRegistered).slice(0, 3);

  return (
    <div>
      <header>
        <div className="container nav-inner">
          <div className="brand">
            <div className="logo">TC</div>
            <div>
              <h1>TurisConecta</h1>
              <p>Conectando turistas e negócios locais</p>
            </div>
          </div>
          <nav>
            <Link to="/">Mapa</Link>
            <Link to="/eventos">Eventos</Link>
            <Link to="/register">Cadastre-se</Link>
            <Link to="/login" className="btn">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="container">
        <main>
          <aside>
            <div className="card">
              <h2 style={{ margin: "0 0 8px 0" }}>Descubra o que a cidade oferece</h2>
              <p className="muted" style={{ marginTop: 0 }}>
                Mapa interativo com pontos verificados (Cadastur & Inventário). Encontre
                atrações, hospedagens e eventos.
              </p>
              <div className="controls">
                <label
                  className="checkbox-row"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={onlyRegistered}
                    onChange={(e) => setOnlyRegistered(e.target.checked)}
                  />
                  <span>Mostrar apenas estabelecimentos verificados (Cadastur)</span>
                </label>
                <div>
                  <label htmlFor="categorySelect">Categoria</label>
                  <select
                    id="categorySelect"
                    className="select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Categoria"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Atração">Atração</option>
                    <option value="Hospedagem">Hospedagem</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Restaurante">Restaurante</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: "14px" }}>
              <h3 style={{ margin: "0 0 8px 0" }}>Destaques</h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "14px",
                  color: "var(--muted)",
                }}
              >
                {highlights.map((p) => (
                  <li key={p.id} style={{ display: "flex", gap: "10px", padding: "8px 0" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "40px",
                        borderRadius: "6px",
                        background: "rgba(16,185,129,0.15)",
                      }}
                    ></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.nome}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {p.categoria} • {p.rating} ★
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section>
            <div className="card">
              <div id="map" ref={mapRef} style={{ height: "400px", width: "100%" }}></div>

              <div className="cards-grid" style={{ marginTop: "14px" }}>
                {filteredPlaces.map((p) => (
                  <div key={p.id} className="place-card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div className="place-title">{p.nome}</div>
                        <div className="place-meta">{p.categoria}</div>
                      </div>
                      <div style={{ fontWeight: 600 }}>{p.rating}★</div>
                    </div>
                    <p style={{ marginTop: "8px", fontSize: "13px", color: "#6b7280" }}>
                      {p.descricao}
                    </p>
                  </div>
                ))}
              </div>

              <div id="events" className="card" style={{ marginTop: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ margin: 0 }}>Próximos eventos</h3>
                  <Link to="/eventos" style={{ color: "var(--accent1)", textDecoration: "none" }}>
                    Ver todos
                  </Link>
                </div>
                <div className="events-row" style={{ marginTop: "12px" }}>
                  {events.map((ev) => (
                    <div key={ev.id} className="event-card">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{ev.titulo}</div>
                        <div style={{ fontSize: "13px", color: "#6b7280" }}>{formatDate(ev.data)}</div>
                      </div>
                      <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
                        {ev.localNome || "Local a confirmar"}
                      </div>
                      <p style={{ marginTop: "8px", fontSize: "13px", color: "#111827" }}>
                        {ev.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer>
        © {new Date().getFullYear()} TurisConecta — MVP • Desenvolvido para hackathon
        {/* HMR test: edit to trigger hot reload */}
      </footer>
    </div>
  );
}
