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

    // Si no existe el empleado, mostramos error simple
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

    // Preparar datos
    const name = escapeHtml(emp.name || "—");
    const surname = escapeHtml(emp.surname || "—");
    const statusRaw = String(emp.status || "—");
    const status = escapeHtml(statusRaw);
    const photoUrl = String(emp.photoUrl || "").trim();
    const dpi = escapeHtml(emp.dpi || "—");
    const phone = escapeHtml(emp.phone || "—");

    const isActive = statusRaw.toLowerCase() === "activo";

    return res.status(200).send(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${name} ${surname} — Verificación</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');

          :root{
            /* Colores extraídos de la imagen */
            --bg-page: #f4f6f9;
            --bg-card: #ffffff;
            --zoomsa-blue: #1b3a75; /* Azul oscuro del logo/título */
            --pill-bg: #ebf5ff;     /* Fondo azul muy claro */
            --pill-text: #2581c4;   /* Texto azul celeste */
            --gray-box: #f8f9fa;    /* Fondo gris del estado */
            --text-main: #111827;
            
            --shadow: 0 20px 60px -10px rgba(0,0,0,0.1);
            --radius-card: 24px;
            --radius-img: 16px;
          }

          *{ box-sizing:border-box; }
          
          body{
            margin:0;
            font-family: 'Roboto', system-ui, -apple-system, sans-serif;
            background: var(--bg-page);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .page-container{
            width: 100%;
            max-width: 900px;
            padding: 20px;
            margin: 0 auto;
          }

          /* HEADER CON LOGO */
          .header{
            text-align: center;
            padding-bottom: 30px;
            padding-top: 20px;
          }
          .header img{
            height: 60px; /* Ajusta según necesidad */
            width: auto;
            object-fit: contain;
          }

          /* TARJETA PRINCIPAL */
          .card{
            background: var(--bg-card);
            border-radius: var(--radius-card);
            box-shadow: var(--shadow);
            padding: 40px;
            width: 100%;
          }

          .card-title{
            text-align: center;
            font-size: 26px;
            font-weight: 700;
            color: var(--zoomsa-blue);
            margin: 0 0 35px 0;
          }

          /* GRID DE CONTENIDO (FOTO IZQ - INFO DER) */
          .content-grid{
            display: grid;
            grid-template-columns: 240px 1fr;
            gap: 40px;
            align-items: center;
          }

          /* FOTO */
          .photo-container{
            width: 100%;
            aspect-ratio: 1/1;
            border-radius: var(--radius-img);
            overflow: hidden;
            background: #e2e8f0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .photo-container img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .photo-fallback{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: #94a3b8;
            font-weight: bold;
          }

          /* INFORMACIÓN */
          .info-col{
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .employee-name{
            font-size: 36px;
            font-weight: 800; /* Extra bold como en la imagen */
            color: #000;
            margin: 0;
            line-height: 1.1;
            letter-spacing: -0.5px;
          }

          /* PILLS (ID, TEL, DPI) */
          .pills-row{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .pill{
            background-color: var(--pill-bg);
            color: var(--pill-text);
            font-weight: 600;
            font-size: 15px;
            padding: 8px 16px;
            border-radius: 999px; /* Forma de cápsula */
            white-space: nowrap;
          }

          /* CAJA DE ESTADO */
          .status-box{
            background-color: var(--gray-box);
            border-radius: 12px;
            padding: 10px 16px;
            width: fit-content;
            margin-top: 5px;
          }
          .status-label{
            font-size: 12px;
            color: #64748b;
            margin-bottom: 4px;
            font-weight: 500;
          }
          .status-value{
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 800;
            font-size: 16px;
            color: #0f172a;
          }
          .dot{
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: ${isActive ? "#16a34a" : "#ca8a04"};
          }

          /* RESPONSIVE */
          @media (max-width: 700px) {
            .card{ padding: 24px; }
            .content-grid{
              grid-template-columns: 1fr;
              text-align: center;
              gap: 24px;
            }
            .photo-container{
              width: 200px;
              margin: 0 auto;
            }
            .pills-row{
              justify-content: center;
            }
            .status-box{
              margin: 5px auto 0;
            }
            .employee-name{
              font-size: 28px;
            }
          }
        </style>
      </head>
      <body>

        <div class="page-container">
          
          <div class="header">
            <img src="https://res.cloudinary.com/dpiqbeatw/image/upload/v1769466074/ZOOMSA_FONDO_TRANSPARENTE_bs0s3y.png" alt="ZOOMSA LABORATORIO" />
          </div>

          <div class="card">
            <h1 class="card-title">Verificación de empleado</h1>

            <div class="content-grid">
              <div class="photo-container">
                ${
                  photoUrl
                    ? `<img src="${photoUrl}" alt="Foto de ${name}" />`
                    : `<div class="photo-fallback">${name.charAt(0)}</div>`
                }
              </div>

              <div class="info-col">
                <h2 class="employee-name">${name} ${surname}</h2>

                <div class="pills-row">
                  <span class="pill">ID: ${escapeHtml(publicId)}</span>
                  <span class="pill">Tel: ${phone}</span>
                  <span class="pill">DPI: ${dpi}</span>
                </div>

                <div class="status-box">
                  <div class="status-label">Estado</div>
                  <div class="status-value">
                    <span class="dot"></span>
                    ${status}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error interno del servidor.");
  }
};
