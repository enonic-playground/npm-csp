export default {
	testEnvironment: 'node',

	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: {
					esModuleInterop: true,
					sourceMap: true, // Needed to get correct Uncovered Line numbers
					skipLibCheck: true,

					// Don't care about type errors in tests
					// npm run check:types will catch type errors in src
					strict: false
				}
			}
		]
	},
}
