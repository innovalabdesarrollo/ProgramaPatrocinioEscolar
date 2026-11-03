import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ObjectId } from 'mongodb';
import { oid, serialize, now } from '../../src/lib/ids.js';

describe('ids', () => {
	it('oid acepta ObjectId válido y rechaza basura', () => {
		const id = new ObjectId();
		assert.equal(String(oid(String(id))), String(id));
		assert.equal(oid('no-es-id'), null);
		assert.equal(oid(''), null);
	});

	it('serialize expone id y oculta passwordHash', () => {
		const id = new ObjectId();
		const out = serialize({ _id: id, nombre: 'Ada', passwordHash: 'x' });
		assert.equal(out.id, String(id));
		assert.equal(out.nombre, 'Ada');
		assert.equal(out.passwordHash, undefined);
		assert.equal(out._id, undefined);
	});

	it('now regresa Date', () => {
		assert.ok(now() instanceof Date);
	});
});
