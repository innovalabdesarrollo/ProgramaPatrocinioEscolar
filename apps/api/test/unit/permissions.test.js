import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, DEFAULT_MATRIX, normalizeMatrix } from '../../src/lib/permissions.js';

describe('permissions.normalizeMatrix', () => {
	it('devuelve defaults con input vacío', () => {
		const m = normalizeMatrix(null);
		assert.equal(m.admin.tablero.write, true);
		assert.equal(m.institucion.permisos.read, false);
		assert.equal(m.visitas.usuarios.read, false);
		assert.equal(Object.keys(m).length, Object.keys(DEFAULT_MATRIX).length);
	});

	it('aplica overrides parciales sin perder módulos', () => {
		const m = normalizeMatrix({
			visitas: { bitacora: { read: true, write: false } }
		});
		assert.equal(m.visitas.bitacora.read, true);
		assert.equal(m.visitas.visitas.write, true);
		assert.equal(MODULES.every((mod) => m.visitas[mod.id]), true);
	});

	it('coerce booleans inválidos', () => {
		const m = normalizeMatrix({
			directivo: { permisos: { read: 1, write: 'yes' } }
		});
		assert.equal(m.directivo.permisos.read, true);
		assert.equal(m.directivo.permisos.write, true);
	});
});
