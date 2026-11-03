import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { suggestedPriority } from '../../src/routes/waitlist.js';

describe('waitlist.suggestedPriority', () => {
	it('escala por días en espera', () => {
		assert.equal(suggestedPriority(0), 4);
		assert.equal(suggestedPriority(6), 4);
		assert.equal(suggestedPriority(7), 3);
		assert.equal(suggestedPriority(14), 2);
		assert.equal(suggestedPriority(30), 1);
		assert.equal(suggestedPriority(90), 1);
	});
});
