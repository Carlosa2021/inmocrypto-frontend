import { upload } from 'thirdweb/storage';
import { client } from './client';

/**
 * Tipo de metadata aceptado por thirdweb para NFTs o archivos.
 * - File
 * - string (URL o ipfs:// hash)
 * - Objeto (requerido 'name')
 * - Array de los anteriores
 */
type MetadataObject = {
  [key: string]: string | number | File | undefined;
  name: string;
};
type MetadataInput =
  | File
  | string
  | MetadataObject
  | Array<File | string | MetadataObject>;

/** Normaliza respuesta: si array de 1 ⇒ string */
function normalizeResult(res: unknown): string | string[] {
  if (Array.isArray(res)) return res.length === 1 ? res[0] : res;
  return typeof res === 'string' ? res : '';
}

/**
 * Sube archivos o metadata NFT a IPFS vía thirdweb/storage, normalizando edge cases de input/output.
 * Robusto: obliga a que los objetos metadata traigan 'name', rechaza blobs puros y detecta arrays anidados.
 */
export async function uploadToIPFS(
  input: MetadataInput,
): Promise<string | string[]> {
  const inputs = Array.isArray(input) ? input : [input];

  for (const f of inputs) {
    if (typeof f === 'object' && !(f instanceof File) && !Array.isArray(f)) {
      if (!('name' in f) || typeof f.name !== 'string' || !f.name.trim()) {
        throw new Error(
          "Cada metadata debe tener un 'name' definido y no vacío.",
        );
      }
    }
    if (
      typeof Blob !== 'undefined' &&
      f instanceof Blob &&
      !(f instanceof File)
    ) {
      throw new Error(
        'No puedes subir Blob puro: sólo File, string o metadata objeto.',
      );
    }
    if (Array.isArray(f)) {
      throw new Error('No admito arrays anidados. Flattea tu input primero.');
    }
  }

  try {
    const result = await upload({
      client,
      files: inputs,
    });
    return normalizeResult(result);
  } catch (error) {
    console.error('Error subiendo a IPFS:', error);
    throw new Error('No se pudo subir a IPFS. Verifica tu archivo/conexión.');
  }
}
