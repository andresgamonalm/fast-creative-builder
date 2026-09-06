/** Enlaces y variables que Cloudflare inyecta en cada petición. */
export interface Entorno {
  readonly BD: D1Database;
  readonly ARCHIVOS: R2Bucket;
  readonly ASSETS: Fetcher;

  readonly URL_SITIO: string;
  readonly CORREO_REMITENTE: string;
  /** Quien tenga este correo se crea como administrador la primera vez que arranca. */
  readonly CORREO_ADMINISTRADOR: string;

  /** Secreto. Si falta, los enlaces se imprimen en consola en vez de enviarse. */
  readonly CLAVE_RESEND?: string;
}

export type Rol = 'administrador' | 'usuario';

export interface Usuario {
  readonly id: string;
  readonly correo: string;
  readonly nombre: string;
  readonly rol: Rol;
  readonly estado: 'activo' | 'bloqueado';
}

/** Contexto de una petición ya autenticada. */
export interface Contexto {
  readonly peticion: Request;
  readonly entorno: Entorno;
  readonly ctx: ExecutionContext;
  readonly url: URL;
  readonly usuario: Usuario;
}
