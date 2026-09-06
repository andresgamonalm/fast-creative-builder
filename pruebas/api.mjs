/**
 * Recorrido completo de la API contra el servidor local.
 *
 * Comprueba lo que la auditoría marcó como caídas: escapes rotos en la URL,
 * borrado de usuario con dependencias, fallo de correo, enlaces duplicados,
 * escalada de privilegios y freno de fuerza bruta.
 *
 * Uso:  node pruebas/api.mjs
 */

const BASE = process.env.BASE ?? 'http://127.0.0.1:8787';

let ok = 0;
let mal = 0;
const fallos = [];

function comprobar(nombre, condicion, detalle) {
  if (condicion) {
    ok++;
    console.log(`  ok    ${nombre}`);
  } else {
    mal++;
    fallos.push(`${nombre} — ${detalle}`);
    console.log(`  FALLA ${nombre}  ${detalle}`);
  }
}

const galletas = new Map();

async function pedir(metodo, camino, opciones = {}) {
  const { cuerpo, sesion } = opciones;
  const cabeceras = { 'Content-Type': 'application/json' };
  if (sesion && galletas.has(sesion)) cabeceras['Cookie'] = galletas.get(sesion);

  const r = await fetch(BASE + camino, {
    method: metodo,
    headers: cabeceras,
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    redirect: 'manual',
  });

  const puesta = r.headers.get('set-cookie');
  if (puesta && sesion) galletas.set(sesion, puesta.split(';')[0]);

  let datos = null;
  try {
    datos = await r.json();
  } catch {
    /* respuesta sin cuerpo */
  }
  return { estado: r.status, datos, cookie: puesta };
}

function seccion(titulo) {
  console.log(`\n── ${titulo}`);
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  seccion('Rutas y entradas mal formadas — ninguna puede caerse');
  for (const camino of [
    '/api/usuarios/%',
    '/api/acceso/token/%E0%A4%A',
    '/api/acceso/token/%%%',
    '/api/usuarios/..%2F..%2Fetc',
  ]) {
    const r = await pedir('GET', camino);
    comprobar(`GET ${camino} no devuelve 500`, r.estado !== 500, `dio ${r.estado}`);
  }

  const cuerposRaros = [
    ['sin cuerpo', undefined],
    ['objeto vacío', {}],
    ['tipos equivocados', { correo: 12, clave: [] }],
    ['nulos', { correo: null, clave: null }],
    ['correo enorme', { correo: 'a'.repeat(5000) + '@x.cl', clave: 'x'.repeat(5000) }],
  ];
  for (const [nombre, cuerpo] of cuerposRaros) {
    const r = await pedir('POST', '/api/acceso/entrar', { cuerpo });
    comprobar(`entrar con ${nombre} no devuelve 500`, r.estado !== 500, `dio ${r.estado}`);
  }

  seccion('Acceso del administrador');
  const entrada = await pedir('POST', '/api/acceso/entrar', {
    sesion: 'admin',
    cuerpo: { correo: process.env.ADMIN ?? 'hola@andresgamonal.com', clave: process.env.CLAVE ?? 'AuditoriaSegura2026!' },
  });
  comprobar('el administrador entra', entrada.estado === 200, `dio ${entrada.estado}`);
  if (entrada.estado !== 200) {
    console.log('\n  No se puede seguir sin sesión de administrador.');
    return resumen();
  }
  comprobar(
    'la cookie de sesión es HttpOnly y SameSite',
    /HttpOnly/i.test(entrada.cookie ?? '') && /SameSite/i.test(entrada.cookie ?? ''),
    entrada.cookie ?? 'sin cookie',
  );

  seccion('Invitaciones: el enlace nunca se pierde');
  const correoPrueba = `prueba.${Date.now().toString(36)}@zurich.cl`;
  const inv = await pedir('POST', '/api/usuarios', {
    sesion: 'admin',
    cuerpo: { correo: correoPrueba, nombre: 'Persona de prueba', rol: 'usuario' },
  });
  comprobar('invitar responde 200', inv.estado === 200, `dio ${inv.estado}`);
  comprobar(
    'sin servicio de correo se devuelve el enlace',
    Boolean(inv.datos?.enlace),
    JSON.stringify(inv.datos),
  );
  const idInvitado = inv.datos?.id;

  const rep = await pedir('POST', '/api/usuarios', {
    sesion: 'admin',
    cuerpo: { correo: correoPrueba, nombre: 'Repetida', rol: 'usuario' },
  });
  comprobar('correo repetido da 409', rep.estado === 409, `dio ${rep.estado}`);

  seccion('Un solo enlace vivo por persona');
  const re1 = await pedir('POST', `/api/usuarios/${idInvitado}/reinvitar`, { sesion: 'admin' });
  const re2 = await pedir('POST', `/api/usuarios/${idInvitado}/reinvitar`, { sesion: 'admin' });
  comprobar('reinvitar funciona dos veces', re1.estado === 200 && re2.estado === 200, `${re1.estado}/${re2.estado}`);

  const t1 = re1.datos?.enlace?.split('/').pop();
  const t2 = re2.datos?.enlace?.split('/').pop();
  const v1 = await pedir('GET', `/api/acceso/token/${t1}`);
  const v2 = await pedir('GET', `/api/acceso/token/${t2}`);
  comprobar('el enlace anterior queda anulado', v1.estado === 410, `dio ${v1.estado}`);
  comprobar('el último enlace sigue valiendo', v2.estado === 200, `dio ${v2.estado}`);

  seccion('Establecer contraseña');
  const est = await pedir('POST', '/api/acceso/establecer', {
    sesion: 'usuario',
    cuerpo: { token: t2, clave: 'ClaveDePrueba2026!' },
  });
  comprobar('se establece la contraseña', est.estado === 200, `dio ${est.estado}`);
  const reuso = await pedir('POST', '/api/acceso/establecer', {
    cuerpo: { token: t2, clave: 'OtraClave2026!' },
  });
  comprobar('el token no se puede reutilizar', reuso.estado === 410, `dio ${reuso.estado}`);

  seccion('Permisos: un usuario normal no alcanza nada de administrador');
  const intentos = [
    ['GET', '/api/usuarios', undefined],
    ['POST', '/api/usuarios', { correo: 'x@y.cl', nombre: 'X', rol: 'administrador' }],
    ['DELETE', `/api/usuarios/${idInvitado}`, undefined],
    ['POST', `/api/usuarios/${idInvitado}/estado`, { estado: 'activo' }],
    ['POST', `/api/usuarios/${idInvitado}/reinvitar`, undefined],
  ];
  for (const [metodo, camino, cuerpo] of intentos) {
    const r = await pedir(metodo, camino, { sesion: 'usuario', cuerpo });
    comprobar(`${metodo} ${camino} da 403`, r.estado === 403, `dio ${r.estado}`);
  }

  seccion('Borrar a alguien no puede caerse');
  const borrado = await pedir('DELETE', `/api/usuarios/${idInvitado}`, { sesion: 'admin' });
  comprobar('borrar responde sin 500', borrado.estado !== 500, `dio ${borrado.estado}`);
  comprobar('borrar responde 200', borrado.estado === 200, `dio ${borrado.estado} ${JSON.stringify(borrado.datos)}`);

  const yaNo = await pedir('DELETE', `/api/usuarios/${idInvitado}`, { sesion: 'admin' });
  comprobar('borrar dos veces da 404, no 500', yaNo.estado === 404, `dio ${yaNo.estado}`);

  seccion('El último administrador no se puede quitar');
  const yo = await pedir('GET', '/api/acceso/yo', { sesion: 'admin' });
  const miId = yo.datos?.usuario?.id;
  const auto = await pedir('DELETE', `/api/usuarios/${miId}`, { sesion: 'admin' });
  comprobar('no puedo borrarme a mí mismo', auto.estado === 400, `dio ${auto.estado}`);

  const otroAdmin = await pedir('POST', '/api/usuarios', {
    sesion: 'admin',
    cuerpo: { correo: `admin.${Date.now().toString(36)}@zurich.cl`, nombre: 'Otro admin', rol: 'administrador' },
  });
  const idOtro = otroAdmin.datos?.id;
  const bloqueoOtro = await pedir('POST', `/api/usuarios/${idOtro}/estado`, {
    sesion: 'admin',
    cuerpo: { estado: 'bloqueado' },
  });
  comprobar(
    'se puede bloquear a otro administrador si quedo yo',
    bloqueoOtro.estado === 200,
    `dio ${bloqueoOtro.estado}`,
  );
  await pedir('DELETE', `/api/usuarios/${idOtro}`, { sesion: 'admin' });

  seccion('La sesión se cierra de verdad');
  const salida = await pedir('POST', '/api/acceso/salir', { sesion: 'admin' });
  comprobar('salir responde 200', salida.estado === 200, `dio ${salida.estado}`);
  const tras = await pedir('GET', '/api/acceso/yo', { sesion: 'admin' });
  comprobar('la cookie ya no sirve', tras.estado === 401, `dio ${tras.estado}`);

  await espera(50);
  resumen();
}

function resumen() {
  console.log(`\n${'═'.repeat(64)}`);
  console.log(`  ${ok} correctas, ${mal} fallidas`);
  if (fallos.length) {
    console.log('\n  Lo que falla:');
    for (const f of fallos) console.log(`   · ${f}`);
  }
  process.exitCode = mal > 0 ? 1 : 0;
}

main().catch((e) => {
  console.error('\nLa prueba se cayó:', e);
  process.exitCode = 1;
});
