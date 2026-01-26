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

    return res.status(200).send(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${name} ${surname} — Empleado</title>
        <style>
          :root{
            --bg: #f6f7fb;
            --card: #ffffff;
            --muted: #5b6472;
            --shadow: 0 16px 45px rgba(0,0,0,.10);
            --radius: 22px;

            --maxw: 720px;
            --pad: clamp(16px, 3.5vw, 30px);

            --h1: clamp(20px, 4.5vw, 30px);
            --text: clamp(14px, 3.2vw, 18px);
            --small: clamp(12px, 2.6vw, 14px);

            --avatar: clamp(96px, 22vw, 140px);
          }

          * { box-sizing: border-box; }
          body {
            margin:0;
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
            background: var(--bg);
            color:#111;
          }

          .wrap {
            max-width: var(--maxw);
            margin: 0 auto;
            padding: var(--pad);
          }

          .card {
            background: var(--card);
            border-radius: var(--radius);
            padding: var(--pad);
            box-shadow: var(--shadow);
          }

          .row {
            display:flex;
            flex-direction: column;
            gap: clamp(14px, 3vw, 22px);
            align-items: stretch;
          }

          /* En pantallas medianas en adelante, ponemos foto + datos en fila */
          @media (min-width: 520px){
            .row{
              flex-direction: row;
              align-items: center;
            }
          }

          .avatar {
            width: var(--avatar);
            height: var(--avatar);
            border-radius: clamp(16px, 3vw, 22px);
            overflow:hidden;
            background:#eef1f6;
            flex: 0 0 auto;
            display:flex;
            align-items:center;
            justify-content:center;
          }
          .avatar img { width:100%; height:100%; object-fit:cover; display:block; }
          .avatar .fallback { font-weight:800; color:#667; font-size: clamp(26px, 7vw, 42px); }

          .meta { min-width: 0; }
          .meta h1 {
            font-size: var(--h1);
            margin:0 0 8px;
            line-height: 1.15;
            letter-spacing: -0.02em;
            word-break: break-word;
          }

          .pills {
            display:flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }

          .pill {
            display:inline-flex;
            align-items:center;
            gap: 8px;
            padding: 10px 12px;
            border-radius: 999px;
            font-size: var(--small);
            background:#eef7ff;
            color:#0b5cab;
            line-height: 1.2;
            max-width: 100%;
            word-break: break-word;
          }

          .grid {
            margin-top: clamp(16px, 3vw, 24px);
            display:grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .item {
            background:#f7f9fc;
            border-radius: 18px;
            padding: clamp(14px, 3vw, 18px);
          }
          .label {
            font-size: var(--small);
            color:#667;
            margin-bottom: 6px;
          }
          .value {
            font-size: var(--text);
            font-weight: 700;
            display:flex;
            align-items:center;
            gap:10px;
          }
          .dot {
            width: 12px;
            height: 12px;
            border-radius:999px;
            background:${isActive ? "#16a34a" : "#f59e0b"};
            display:inline-block;
            flex: 0 0 auto;
          }

          .foot {
            margin-top: clamp(16px, 3vw, 22px);
            color:#7a8596;
            font-size: var(--small);
            text-align:center;
          }

          /* Mejor “tap targets” */
          @media (max-width: 360px){
            .pill { padding: 12px 14px; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <div class="row">
              <div class="avatar">
                ${
                  photoUrl
                    ? `<img src="${photoUrl}" alt="${name} ${surname}" loading="lazy" referrerpolicy="no-referrer" />`
                    : `<span class="fallback">${name.charAt(0) || "—"}${surname.charAt(0) || ""}</span>`
                }
              </div>

              <div class="meta">
                <h1>${name} ${surname}</h1>

                <div class="pills">
                  <span class="pill">ID: ${escapeHtml(publicId)}</span>
                  <span class="pill">Tel: ${phone}</span>
                  <span class="pill">DPI: ${dpi}</span>
                </div>
              </div>
            </div>

            <div class="grid">
              <div class="item">
                <div class="label">Estado</div>
                <div class="value"><span class="dot"></span>${status}</div>
              </div>
            </div>

            <div class="foot">Verificación de empleado</div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).send("Error al mostrar el empleado.");
  }
};
