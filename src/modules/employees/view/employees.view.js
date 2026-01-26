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
    const role = escapeHtml(emp.role || "—"); // si quitaste role del schema, esto igual no revienta

    const isActive = statusRaw.toLowerCase() === "activo";

    return res.status(200).send(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${name} ${surname} — Empleado</title>
        <style>
          body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; background:#f6f7fb; }
          .wrap { max-width: 420px; margin: 0 auto; padding: 24px; }
          .card { background:#fff; border-radius: 18px; padding: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.08); }
          .row { display:flex; gap:14px; align-items:center; }
          .avatar { width:86px; height:86px; border-radius: 16px; overflow:hidden; background:#eef1f6; flex:0 0 auto; display:flex; align-items:center; justify-content:center; }
          .avatar img { width:100%; height:100%; object-fit:cover; display:block; }
          .avatar .fallback { font-weight:700; color:#667; font-size:22px; }
          .meta h1 { font-size: 18px; margin:0 0 4px; line-height:1.2; }
          .meta p { margin:0; color:#556; font-size: 14px; }
          .pill { display:inline-block; margin-top:10px; padding:6px 10px; border-radius:999px; font-size:12px; background:#eef7ff; color:#0b5cab; }
          .grid { margin-top: 14px; display:grid; grid-template-columns: 1fr; gap:10px; }
          .item { background:#f7f9fc; border-radius: 14px; padding: 12px; }
          .label { font-size: 12px; color:#667; margin-bottom:4px; }
          .value { font-size: 14px; color:#111; font-weight: 600; display:flex; align-items:center; gap:8px; }
          .dot { width:10px; height:10px; border-radius:999px; background:${isActive ? "#16a34a" : "#f59e0b"}; display:inline-block; }
          .foot { margin-top: 14px; color:#889; font-size: 12px; text-align:center; }
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
                <p>${role}</p>
                <span class="pill">ID: ${escapeHtml(publicId)}</span>
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
