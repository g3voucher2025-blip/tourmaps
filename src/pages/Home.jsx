import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/style.css"; // Certifique-se que existe

const places = [
  {
    id: 1,
    nome: "Praia Central",
    categoria: "Atração",
    latitude: -23.552,
    longitude: -46.639,
    isRegistered: true,
    descricao: "Praia urbana com quiosques e atividades aquáticas.",
    rating: 4.6,
  },
  {
    id: 2,
    nome: "Hotel Bela Vista",
    categoria: "Hospedagem",
    latitude: -23.55,
    longitude: -46.635,
    isRegistered: false,
    descricao: "Hotel confortável no centro da cidade.",
    rating: 4.0,
  },
  {
    id: 3,
    nome: "Museu Municipal",
    categoria: "Cultura",
    latitude: -23.551,
    longitude: -46.637,
    isRegistered: true,
    descricao: "Acervo histórico local e exposições temporárias.",
    rating: 4.8,
  },
  {
    id: 4,
    nome: "Restaurante Raízes",
    categoria: "Restaurante",
    latitude: -23.553,
    longitude: -46.6365,
    isRegistered: true,
    descricao: "Culinária local com ingredientes regionais.",
    rating: 4.4,
  },
  {
    id: 5,
    nome: "Centro Cultural",
    categoria: "Cultura",
    latitude: -23.5495,
    longitude: -46.636,
    isRegistered: true,
    descricao: "Espaço para exposições e apresentações artísticas.",
    rating: 4.2,
  },
];

const events = [
  {
    id: 101,
    titulo: "Festival Gastronômico",
    descricao: "Comidas típicas, música e atividades para a família.",
    data: "2025-11-15",
    localNome: "Praia Central",
    localId: 1,
  },
  {
    id: 102,
    titulo: "Noite de Seresta",
    descricao: "Apresentação de artistas locais e exposição.",
    data: "2025-11-20",
    localNome: "Museu Municipal",
    localId: 3,
  },
  {
    id: 103,
    titulo: "Feira de Artesanato",
    descricao: "Bancas com produtos locais e oficinas.",
    data: "2025-11-22",
    localNome: "Centro",
    localId: null,
  },
];

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
    const cityCenter = [-23.551, -46.637];
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
            <a href="mapa.html">Mapa</a>
            <a href="eventos.html">Eventos</a>
            <a href="cadastro.html">Cadastre-se</a>
            <a href="login.html" className="btn">
              Login
            </a>
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
                  <a href="proximoseventos.html" style={{ color: "var(--accent1)", textDecoration: "none" }}>
                    Ver todos
                  </a>
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
      </footer>
    </div>
  );
}
