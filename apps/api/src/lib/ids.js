import { ObjectId } from 'mongodb';

export function oid(id) {
	if (!id) return null;
	try {
		return new ObjectId(String(id));
	} catch {
		return null;
	}
}

export function serialize(doc) {
	if (!doc) return null;
	if (Array.isArray(doc)) return doc.map(serialize);
	const out = { ...doc, id: String(doc._id) };
	delete out._id;
	delete out.passwordHash;
	return out;
}

export function now() {
	return new Date();
}
