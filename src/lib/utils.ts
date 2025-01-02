export function generateUUID(): string {
	// Generate 16 random bytes
	const bytes = new Uint8Array(16)
	crypto.getRandomValues(bytes)

	// Set version (4) and variant bits
	bytes[6] = (bytes[6] & 0x0f) | 0x40  // Version 4
	bytes[8] = (bytes[8] & 0x3f) | 0x80  // Variant 1

	// Convert to hex string with proper UUID format
	const hex = Array.from(bytes)
		.map(b => b.toString(16).padStart(2, '0'))
		.join('')

	return [
		hex.slice(0, 8),
		hex.slice(8, 12),
		hex.slice(12, 16),
		hex.slice(16, 20),
		hex.slice(20)
	].join('-')
} 