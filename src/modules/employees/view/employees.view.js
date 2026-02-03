import { findEmpleadoByPublicId } from "../employees.repository.js";

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const viewEmpleadoCard = async (req, res) => {
  try {
    const { publicId } = req.params;
    const emp = await findEmpleadoByPublicId(publicId);

    if (!emp) {
      return res.status(404).send(`
        <!doctype html>
        <html lang="es">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>Empleado no encontrado</title>
          </head>
          <body style="font-family: system-ui; padding: 24px;">
            <h2>Empleado no encontrado</h2>
            <p>ID: ${escapeHtml(publicId)}</p>
          </body>
        </html>
      `);
    }

    const name = escapeHtml(emp.name || "—");
    const surname = escapeHtml(emp.surname || "—");
    const statusRaw = String(emp.status || "—");
    const status = escapeHtml(statusRaw);
    const photoUrl = String(emp.photoUrl || "").trim();
    const dpi = escapeHtml(emp.dpi || "—");
    const phone = escapeHtml(emp.phone || "—");

    const isActive = statusRaw.toLowerCase() === "activo";

    // Logo de la empresa (se mantiene arriba fuera de la card si lo deseas, o se quita si no sale en tu diseño nuevo)
    const LOGO_URL =
      "https://res.cloudinary.com/dpiqbeatw/image/upload/v1769466074/ZOOMSA_FONDO_TRANSPARENTE_bs0s3y.png";

    return res.status(200).send(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>${name} ${surname}</title>
          <style>
            /* Importamos fuente limpia */
            @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap");

            :root {
              --bg-body: #f3f4f6;
              --bg-card: #ffffff;
              --text-dark: #111827;
              --text-blue: #1d5ba9;
              --text-gray: #6b7280;
              --bg-pill: #eef8ff;
              --text-pill: #1d5ba9;
              --bg-status: #f8fafc; /* Gris muy claro para la caja de estado */
              --green-dot: #10b981;
              --amber-dot: #f59e0b;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family:
                "Inter",
                system-ui,
                -apple-system,
                sans-serif;
              background: var(--bg-body);
              display: flex;
              flex-direction: column;
              align-items: center;
              min-height: 100vh;
              padding: 20px;
            }

            /* Logo superior fuera de la tarjeta */
            .brand-header {
              margin-bottom: 24px;
              margin-top: 10px;
            }
            .brand-header img {
              height: 50px;
              width: auto;
            }

            /* TARJETA PRINCIPAL */
            .card {
              background: var(--bg-card);
              border-radius: 24px; /* Bordes muy redondeados como en la foto */
              box-shadow: 0 10px 40px -5px rgba(0, 0, 0, 0.08);
              width: 100%;
              max-width: 800px;
              padding: 40px;
              display: flex;
              flex-direction: column;
              gap: 32px;
            }

            /* SECCIÓN SUPERIOR: FOTO Y DATOS */
            .top-section {
              display: flex;
              gap: 32px;
              align-items: center;
            }

            .photo-wrapper {
              flex-shrink: 0;
              width: 180px;
              height: 180px;
              border-radius: 20px;
              overflow: hidden;
              background: #e5e7eb;
            }
            .photo-wrapper img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .photo-fallback {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 4rem;
              color: #9ca3af;
              font-weight: bold;
            }

            .info-wrapper {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }

            .emp-name {
              font-size: 32px;
              font-weight: 800;
              color: var(--text-blue);
              margin: 20px 0 0 0;
              line-height: 1.1;
            }

            /* BURBUJAS DE DATOS (PILLS) */
            .pills {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            .pill {
              background: var(--bg-pill);
              color: var(--text-pill);
              padding: 8px 16px;
              border-radius: 99px;
              font-size: 14px;
              font-weight: 600;
              white-space: nowrap;
            }

            /* SECCIÓN DE ESTADO (CAJA GRIS ANCHA) */
            .status-container {
              background-color: var(--bg-status);
              border-radius: 16px;
              padding: 24px 32px;
              width: 100%;
            }
            .status-label {
              font-size: 13px;
              color: var(--text-gray);
              margin-bottom: 8px;
              font-weight: 500;
            }
            .status-row {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 18px;
              font-weight: 800;
              color: var(--text-blue);
            }
            .dot {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: ${isActive ? "var(--green-dot)" : "var(--amber-dot)"};
            }

            /* RESPONSIVE MÓVIL */
            @media (max-width: 650px) {
              .card {
                padding: 24px;
              }
              .top-section {
                flex-direction: column;
                text-align: center;
                gap: 20px;
              }
              .info-wrapper {
                align-items: center;
              }
              .pills {
                justify-content: center;
              }
              .emp-name {
                font-size: 26px;
              }
              .status-container {
                padding: 16px 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="brand-header">
            <img src="${LOGO_URL}" alt="Zoomsa" />
          </div>

          <div class="card">
            <div class="top-section">
              <div class="photo-wrapper">
                ${
                  photoUrl
                    ? `<img src="${photoUrl}" alt="${name}" />`
                    : `
                <div class="photo-fallback">${name.charAt(0)}</div>
                `
                }
              </div>

              <div class="info-wrapper">
                <div class="pills">
                  <span class="pill">ID: ${escapeHtml(publicId)}</span>
                  <span class="pill">Tel: ${phone}</span>
                  <span class="pill">DPI: ${dpi}</span>
                </div>
                <h1 class="emp-name">${name} ${surname}</h1>
              </div>
            </div>

            <div class="status-container">
              <div class="status-label">Estado</div>
              <div class="status-row">
                <span class="dot"></span>
                <span>${status}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).send("Error interno.");
  }
};
