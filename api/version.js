// Dice qué versión de la app está publicada ahora mismo.
//
// Para qué: la app abierta en la compu del taller pregunta cada tanto si salió
// una versión nueva, y si salió muestra la barra "Hay una versión nueva" con el
// botón Actualizar. Antes eso se hacía pidiendo el index.html (7 KB) y leyendo
// el nombre del bundle; el problema es que el index.html lo sirve el cache de
// Vercel con `max-age=0, must-revalidate`, así que podía venir viejo un rato.
//
// Esta ruta es una función, y las funciones de Vercel salen con
// `Cache-Control: no-store` por defecto: nunca se cachea, ni en el borde ni en
// el navegador. Y la respuesta pesa ~60 bytes en vez de 7 KB.
//
// La versión es el commit del deploy (VERCEL_GIT_COMMIT_SHA), que Vercel pone
// solo. La app se compila con ESE MISMO valor adentro (ver vite.config.js), así
// que comparar los dos es comparar "qué deploy tengo" contra "qué deploy hay".
//
// Si la variable no está (por ejemplo corriendo local), devuelve vacío y la app
// se da cuenta y vuelve al método viejo de leer el index.html. Nunca inventa
// una actualización que no existe.

function versionDelDeploy() {
  return (
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_DEPLOYMENT_ID ||
    ""
  );
}

export default function handler(req, res) {
  // Por las dudas, aunque Vercel ya lo pone en las funciones.
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).end(JSON.stringify({ version: versionDelDeploy() }));
}
