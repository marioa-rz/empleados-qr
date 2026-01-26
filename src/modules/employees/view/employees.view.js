import { findEmpleadoByPublicId } from "../employees.model.js";

export const viewEmpleadoCard = async (req, res) => {
  try {
    const { publicId } = req.params;
    const emp = await findEmpleadoByPublicId(publicId);

    if (!emp) {
      return res.status(404).send(`
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
          <body style="font-family: system-ui; padding: 24px;">
            <h2>Empleado no encontrado</h2>
            <p>ID: ${publicId}</p>
          </body>
        </html>
      `);
    }

    // Si algún día querés ocultar datos sensibles, aquí controlás qué se muestra
    const name = emp.name ?? "—";
    const role = emp.role ?? "—";
    const status = emp.status ?? "—";
    const photoUrl = emp.photoUrl ?? "";

    return res.status(200).send(`
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${name} — Empleado</title>
        <style>
          body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; background:#f6f7fb; }
          .wrap { max-width: 420px; margin: 0 auto; padding: 24px; }
          .card { background:#fff; border-radius: 18px; padding: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.08); }
          .row { display:flex; gap:14px; align-items:center; }
          .avatar { width:86px; height:86px; border-radius: 16px; overflow:hidden; background:#eef1f6; flex:0 0 auto; }
          .avatar img { width:100%; height:100%; object-fit:cover; display:block; }
          .meta h1 { font-size: 18px; margin:0 0 4px; }
          .meta p { margin:0; color:#556; font-size: 14px; }
          .pill { display:inline-block; margin-top:10px; padding:6px 10px; border-radius:999px; font-size:12px; background:#eef7ff; color:#0b5cab; }
          .grid { margin-top: 14px; display:grid; grid-template-columns: 1fr; gap:10px; }
          .item { background:#f7f9fc; border-radius: 14px; padding: 12px; }
          .label { font-size: 12px; color:#667; margin-bottom:4px; }
          .value { font-size: 14px; color:#111; font-weight: 600; }
          .foot { margin-top: 14px; color:#889; font-size: 12px; text-align:center; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <div class="row">
              <div class="avatar">
                ${photoUrl ? `<img src="${photoUrl}" alt="${name}" />` : ``}
              </div>
              <div class="meta">
                <h1>${name}</h1>
                <p>${role}</p>
                <span class="pill">ID: ${publicId}</span>
              </div>
            </div>

            <div class="grid">
              <div class="item">
                <div class="label">Estado</div>
                <div class="value">${status}</div>
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
