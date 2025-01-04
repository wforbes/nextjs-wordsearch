const now = new Date();
export const mockUser  = {
	user: {
		id: '42444f9f-f53c-4ac3-8d04-ac84c8635033',
		name: 'TestUser1',
		image: null,
		email: 'test1@example.com'
	},
	expires: new Date(now.setMonth(now.getMonth() + 1)).toISOString()
}