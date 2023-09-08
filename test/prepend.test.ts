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
		describe('prepend', () => {
			test('prepends on empty directives', () => {
				const csp = new ContentSecurityPolicy({}, { logger })
					.prepend(DEFAULT_SRC, UNSAFE_INLINE);
				expect(csp.directives).toStrictEqual({
					'default-src': [ UNSAFE_INLINE ],
				});
			});
			test('prepends a single value', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [ UNSAFE_EVAL ],
				}, { logger })
					.prepend(DEFAULT_SRC, UNSAFE_INLINE);
				expect(csp.directives).toStrictEqual({
					'default-src': [ UNSAFE_INLINE, UNSAFE_EVAL ],
				});
			});
			test('prepends an array', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [ UNSAFE_EVAL ],
				}, { logger })
					.prepend(DEFAULT_SRC, [UNSAFE_HASHED_ATTRIBUTES, UNSAFE_INLINE]);
				expect(csp.directives).toStrictEqual({
					'default-src': [ UNSAFE_HASHED_ATTRIBUTES, UNSAFE_INLINE, UNSAFE_EVAL ],
				});
			});
			test('skips unsupported directives', () => {
				const csp = new ContentSecurityPolicy({}, { logger })
					// @ts-expect-error
					.prepend('fnord-src', [ NONE ]);
				expect(csp.directives).toStrictEqual({});
			});
		});
	});
});
