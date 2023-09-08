import {
	describe,
	expect,
	test
} from '@jest/globals';
import {
	DEFAULT_SRC,
	NONE,
	UNSAFE_EVAL,
	UNSAFE_HASHED_ATTRIBUTES,
	UNSAFE_INLINE,
	ContentSecurityPolicy,
	type ContentSecurityPolicyLogger
} from '../src';


const logger: ContentSecurityPolicyLogger = {
	warn: () => {},
}


describe('lib', () => {
	describe('csp', () => {
		describe('append', () => {
			test('appends a single value', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [ UNSAFE_EVAL ],
				}, { logger })
					.append(DEFAULT_SRC, UNSAFE_INLINE);
				expect(csp.directives).toStrictEqual({
					'default-src': [ UNSAFE_EVAL, UNSAFE_INLINE ],
				});
			});
			test('appends an array', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [ UNSAFE_EVAL ],
				}, { logger })
					.append(DEFAULT_SRC, [UNSAFE_HASHED_ATTRIBUTES, UNSAFE_INLINE]);
				expect(csp.directives).toStrictEqual({
					'default-src': [ UNSAFE_EVAL, UNSAFE_HASHED_ATTRIBUTES, UNSAFE_INLINE ],
				});
			});
			test('skips unsupported directives', () => {
				const csp = new ContentSecurityPolicy({}, { logger })
					// @ts-expect-error
					.append('fnord-src', [ NONE ]);
				expect(csp.directives).toStrictEqual({});
			});
		});
	});
});
