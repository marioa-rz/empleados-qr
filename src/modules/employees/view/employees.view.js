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

    // Logo fijo (como en tu screenshot)
    const LOGO_URL =
      "https://res.cloudinary.com/dpiqbeatw/image/upload/v1769466074/ZOOMSA_FONDO_TRANSPARENTE_bs0s3y.png";

    return res.status(200).send(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${name} ${surname} — Verificación</title>
        <style>
          :root{
            --bg: #f6f7fb;
            --card: #ffffff;
            --shadow: 0 18px 55px rgba(0,0,0,.12);
            --radius: clamp(18px, 3vw, 26px);

            --maxw: 1100px;
            --pad: clamp(16px, 3vw, 28px);

            --title: clamp(26px, 3.6vw, 44px);
            --name: clamp(28px, 4vw, 48px);
            --text: clamp(14px, 2vw, 18px);
            --small: clamp(12px, 1.7vw, 14px);

            --blue: #1f3b7a;
            --pillBg: #eaf4ff;
            --pillText: #1b5ea7;
          }

          *{ box-sizing:border-box; }
          body{
            margin:0;
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
            background: var(--bg);
            color:#0f172a;
          }

          .page{
            max-width: var(--maxw);
            margin: 0 auto;
            padding: clamp(18px, 3.2vw, 36px);
          }

          /* LOGO ARRIBA, GRANDE */
          .brandTop{
            display:flex;
            justify-content:center;
            align-items:center;
            padding: clamp(10px, 2vw, 18px) 0 clamp(18px, 3vw, 28px);
          }
          .brandTop img{
            width: clamp(220px, 42vw, 520px);
            height:auto;
            object-fit:contain;
          }

          /* CARD PRINCIPAL */
          .card{
            background: var(--card);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: clamp(20px, 3vw, 34px);
          }

          .cardTitle{
            text-align:center;
            font-size: var(--title);
            font-weight: 800;
            color: var(--blue);
            margin: 0 0 clamp(18px, 3vw, 28px);
            letter-spacing: -0.02em;
          }

          /* CUERPO: foto izquierda + info derecha */
          .body{
            display:grid;
            grid-template-columns: 260px 1fr;
            gap: clamp(18px, 3vw, 34px);
            align-items:center;
          }

          .photo{
            width: 100%;
            max-width: 260px;
            aspect-ratio: 1 / 1;
            border-radius: clamp(18px, 2.5vw, 26px);
            overflow:hidden;
            background:#e9edf3;
          }
          .photo img{
            width:100%;
            height:100%;
            object-fit:cover;
            display:block;
          }
          .photoFallback{
            width:100%;
            height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size: clamp(40px, 6vw, 64px);
            font-weight: 900;
            color:#64748b;
          }

          .info{
            min-width: 0;
          }

          .empName{
            font-size: var(--name);
            font-weight: 900;
            margin: 0 0 14px;
            letter-spacing: -0.03em;
            line-height: 1.05;
            word-break: break-word;
          }

          .pills{
            display:flex;
            flex-wrap:wrap;
            gap: 14px;
            margin-bottom: 14px;
          }

          .pill{
            background: var(--pillBg);
            color: var(--pillText);
            padding: 12px 18px;
            border-radius: 999px;
            font-size: clamp(14px, 1.8vw, 18px);
            font-weight: 700;
            display:inline-flex;
            align-items:center;
            gap: 10px;
            max-width: 100%;
            word-break: break-word;
          }

          /* Estado como tarjetita pequeña */
          .statusBox{
            width: fit-content;
            background: #f7f9fc;
            border-radius: 14px;
            padding: 12px 16px;
          }
          .statusLabel{
            font-size: var(--small);
            color:#6b7280;
            margin-bottom: 6px;
          }
          .statusRow{
            display:inline-flex;
            align-items:center;
            gap: 10px;
            font-size: clamp(14px, 1.9vw, 18px);
            font-weight: 800;
            color:#0f172a;
          }
          .dot{
            width: 12px;
            height: 12px;
            border-radius: 999px;
            background: ${isActive ? "#16a34a" : "#f59e0b"};
          }

          .footer{
            text-align:center;
            color:#94a3b8;
            font-size: clamp(12px, 1.6vw, 14px);
            margin-top: clamp(18px, 3vw, 26px);
          }

          /* RESPONSIVE: en móvil se apila */
          @media (max-width: 820px){
            .body{
              grid-template-columns: 1fr;
              justify-items: center;
              text-align: center;
            }
            .photo{ max-width: 320px; }
            .pills{ justify-content: center; }
            .statusBox{ margin: 0 auto; }
          }

          @media (max-width: 420px){
            .pill{
              width: 100%;
              justify-content: center;
              padding: 12px 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">

          <div class="brandTop">
            <img src="${LOGO_URL}" alt="ZOOMSA" />
          </div>

          <div class="card">
            <h2 class="cardTitle">Verificación de empleado</h2>

            <div class="body">
              <div class="photo">
                ${
                  photoUrl
                    ? `<img src="${photoUrl}" alt="${name} ${surname}" loading="lazy" referrerpolicy="no-referrer" />`
                    : `<div class="photoFallback">${name.charAt(0) || "—"}${surname.charAt(0) || ""}</div>`
                }
              </div>

              <div class="info">
                <h1 class="empName">${name} ${surname}</h1>

                <div class="pills">
                  <span class="pill">ID: ${escapeHtml(publicId)}</span>
                  <span class="pill">Tel: ${phone}</span>
                  <span class="pill">DPI: ${dpi}</span>
                </div>

                <div class="statusBox">
                  <div class="statusLabel">Estado</div>
                  <div class="statusRow">
                    <span class="dot"></span>
                    <span>${status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">Verificación de empleado</div>
          </div>

        </div>
      </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).send("Error al mostrar el empleado.");
  }
};
