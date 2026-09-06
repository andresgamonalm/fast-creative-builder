/**
 * Envío de correo, solo para invitaciones y recuperación de acceso.
 *
 * Si no hay clave de Resend configurada, el enlace se imprime en la consola
 * en lugar de enviarse. Así el desarrollo local funciona sin dar de alta
 * ningún servicio, y sin fallar en silencio.
 */

import type { Entorno } from './entorno.js';

interface Mensaje {
  readonly para: string;
  readonly asunto: string;
  readonly titulo: string;
  readonly cuerpo: string;
  readonly textoBoton: string;
  readonly enlace: string;
  readonly pie: string;
}

function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function plantilla(m: Mensaje): string {
  return `<!doctype html>
<html lang="es"><body style="margin:0;padding:32px 16px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#ffffff;border-radius:12px;padding:32px">
<tr><td>
  <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#111827">${escapar(m.titulo)}</h1>
  <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b5563">${escapar(m.cuerpo)}</p>
  <p style="margin:0 0 24px">
    <a href="${escapar(m.enlace)}" style="display:inline-block;padding:13px 26px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:bold">${escapar(m.textoBoton)}</a>
  </p>
  <p style="margin:0 0 6px;font-size:13px;color:#6b7280">Si el botón no funciona, copia este enlace en tu navegador:</p>
  <p style="margin:0 0 24px;font-size:12px;color:#6b7280;word-break:break-all">${escapar(m.enlace)}</p>
  <p style="margin:0;font-size:13px;color:#9ca3af">${escapar(m.pie)}</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/**
 * Devuelve `true` si el correo salió de verdad, `false` si se registró en
 * consola. Quien llama decide si eso importa.
 */
export async function enviar(entorno: Entorno, m: Mensaje): Promise<boolean> {
  if (!entorno.CLAVE_RESEND) {
    console.info(`[correo] Sin CLAVE_RESEND. Enlace para ${m.para}: ${m.enlace}`);
    return false;
  }

  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${entorno.CLAVE_RESEND}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: entorno.CORREO_REMITENTE,
      to: [m.para],
      subject: m.asunto,
      html: plantilla(m),
    }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => '');
    console.error(`[correo] Resend rechazó el envío (${respuesta.status}): ${detalle.slice(0, 300)}`);
    throw new Error('No se pudo enviar el correo.');
  }

  return true;
}

export function correoInvitacion(entorno: Entorno, para: string, enlace: string): Mensaje {
  return {
    para,
    enlace,
    asunto: 'Te han invitado a Fast Creative Builder',
    titulo: 'Te han invitado a Fast Creative Builder',
    cuerpo:
      'Entra y elige tu contraseña para empezar a crear. El enlace caduca en 7 días y solo se puede usar una vez.',
    textoBoton: 'Crear mi contraseña',
    pie: 'Si no esperabas esta invitación, ignora este correo.',
  };
}

export function correoRecuperacion(entorno: Entorno, para: string, enlace: string): Mensaje {
  return {
    para,
    enlace,
    asunto: 'Recuperar el acceso a Fast Creative Builder',
    titulo: 'Recuperar tu acceso',
    cuerpo:
      'Pulsa el botón para elegir una contraseña nueva. El enlace caduca en 30 minutos y solo se puede usar una vez.',
    textoBoton: 'Elegir contraseña nueva',
    pie: 'Si no has pedido esto, ignora el correo. Tu contraseña actual sigue funcionando.',
  };
}
