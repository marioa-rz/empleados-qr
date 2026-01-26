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
            --bg:#f6f7fb;
            --card:#fff;
            --shadow:0 16px 45px rgba(0,0,0,.10);
            --radius:22px;

            --pad:clamp(16px,4vw,28px);
            --maxw:720px;

            --h1:clamp(22px,5vw,32px);
            --text:clamp(14px,3.2vw,18px);
            --small:clamp(12px,2.8vw,14px);
          }

          *{box-sizing:border-box}
          body{
            margin:0;
            font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;
            background:var(--bg);
            color:#111;
          }

          .wrap{
            max-width:var(--maxw);
            margin:0 auto;
            padding:var(--pad);
          }

          .card{
            background:var(--card);
            border-radius:var(--radius);
            overflow:hidden;
            box-shadow:var(--shadow);
          }

          /* FOTO FULL WIDTH */
          .hero{
            width:100%;
            aspect-ratio:16/10;
            background:#e9edf3;
          }
          .hero img{
            width:100%;
            height:100%;
            object-fit:cover;
            display:block;
          }
          .hero-fallback{
            width:100%;
            height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:clamp(36px,10vw,56px);
            font-weight:800;
            color:#667;
          }

          .content{
            padding:var(--pad);
          }

          h1{
            font-size:var(--h1);
            margin:0 0 14px;
            line-height:1.15;
          }

          .pills{
            display:flex;
            flex-wrap:wrap;
            gap:10px;
          }

          .pill{
            padding:10px 14px;
            border-radius:999px;
            background:#eef7ff;
            color:#0b5cab;
            font-size:var(--small);
            font-weight:600;
          }

          .grid{
            padding:0 var(--pad) var(--pad);
          }

          .item{
            background:#f7f9fc;
            border-radius:18px;
            padding:16px;
          }

          .label{
            font-size:var(--small);
            color:#667;
            margin-bottom:6px;
          }

          .status{
            display:inline-flex;
            align-items:center;
            gap:6px;
            font-size:13px;
            font-weight:600;
            color:#334155;
          }

          .dot{
            width:8px;
            height:8px;
            border-radius:999px;
            background:${isActive ? "#16a34a" : "#f59e0b"};
          }

          .foot{
            text-align:center;
            font-size:var(--small);
            color:#7a8596;
            padding-bottom:var(--pad);
          }

          /* LOGO ZOOMSA */
          .brand{
            display:flex;
            justify-content:center;
            margin-top:18px;
          }
          .brand img{
            width:clamp(140px,45vw,220px);
            height:auto;
          }
        </style>
      </head>

      <body>
        <div class="wrap">

          <div class="card">

            <div class="hero">
              ${
                photoUrl
                  ? `<img src="${photoUrl}" alt="${name} ${surname}" loading="lazy" />`
                  : `<div class="hero-fallback">${name.charAt(0)}${surname.charAt(0)}</div>`
              }
            </div>

            <div class="content">
              <h1>${name} ${surname}</h1>

              <div class="pills">
                <span class="pill">ID: ${escapeHtml(publicId)}</span>
                <span class="pill">Tel: ${phone}</span>
                <span class="pill">DPI: ${dpi}</span>
              </div>
            </div>

            <div class="grid">
              <div class="item">
                <div class="label">Estado</div>
                <div class="status">
                  <span class="dot"></span>
                  ${status}
                </div>
              </div>
            </div>

            <div class="foot">Verificación de empleado</div>
          </div>

          <div class="brand">
            <img
              src="https://res.cloudinary.com/dpiqbeatw/image/upload/v1769466074/ZOOMSA_FONDO_TRANSPARENTE_bs0s3y.png"
              alt="ZOOMSA"
            />
          </div>

        </div>
      </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).send("Error al mostrar el empleado.");
  }
};
