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
	UNSAFE_HASHES,
	UNSAFE_INLINE,
	ContentSecurityPolicy,
	type ContentSecurityPolicyLogger
} from '../src';


const logger: ContentSecurityPolicyLogger = {
	warn: () => {},
}


describe('lib', () => {
	describe('csp', () => {
		describe('remove', () => {
			test('skips unsupported directives', () => {
				const csp = new ContentSecurityPolicy({}, { logger })
					// @ts-expect-error
					.remove('fnord-src', 'ignored');
				expect(csp.directives).toStrictEqual({});
			});
			test('does nothing in empty directives', () => {
				const csp = new ContentSecurityPolicy({}, { logger })
					.remove(DEFAULT_SRC, 'ignored');
				expect(csp.directives).toStrictEqual({});
			});
			test('removes a single value', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [ NONE ],
				}, { logger })
					.remove(DEFAULT_SRC, NONE);
				expect(csp.directives).toStrictEqual({
					'default-src': [],
				});
			});
			test('removes a multiple values', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [
						UNSAFE_EVAL,
						UNSAFE_HASHED_ATTRIBUTES,
						UNSAFE_HASHES,
						UNSAFE_INLINE
					],
				}, { logger })
					.remove(DEFAULT_SRC, [
						UNSAFE_HASHED_ATTRIBUTES,
						UNSAFE_INLINE
					]);
				expect(csp.directives).toStrictEqual({
					'default-src': [
						UNSAFE_EVAL,
						UNSAFE_HASHES
					],
				});
			});
		});
	});
});
