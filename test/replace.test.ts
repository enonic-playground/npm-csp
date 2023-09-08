import {
	describe,
	expect,
	test
} from '@jest/globals';
import {
	DEFAULT_SRC,
	UNSAFE_EVAL,
	ContentSecurityPolicy,
	type ContentSecurityPolicyLogger
} from '../src';


const logger: ContentSecurityPolicyLogger = {
	warn: () => {},
}


describe('lib', () => {
	describe('csp', () => {
		describe('replace', () => {
			test('skips unsupported directives', () => {
				const csp = new ContentSecurityPolicy({}, { logger })
					// @ts-expect-error
					.replace('fnord-src', 'ignored1', 'ignored2');
				expect(csp.directives).toStrictEqual({});
			});
			test('does nothing in empty directives', () => {
				const csp = new ContentSecurityPolicy({}, { logger })
					.replace(DEFAULT_SRC, 'ignored1', 'ignored2');
				expect(csp.directives).toStrictEqual({});
			});
			test('does nothing when neither item nor replacement is found', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [ UNSAFE_EVAL ],
				}, { logger })
					.replace(DEFAULT_SRC, 'non-existing-item', 'non-existing-replacement');
				expect(csp.directives).toStrictEqual({
					'default-src': [ UNSAFE_EVAL ],
				});
			});
			test('replaces existing-item', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [ 'existing-item', UNSAFE_EVAL ],
				}, { logger })
					.replace(DEFAULT_SRC, 'existing-item', 'non-existing-replacement');
				expect(csp.directives).toStrictEqual({
					'default-src': [ 'non-existing-replacement', UNSAFE_EVAL ],
				});
			});
			test('does nothing when only replacement is found', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [ UNSAFE_EVAL, 'existing-replacement' ],
				}, { logger })
					.replace(DEFAULT_SRC, 'non-existing-item', 'existing-replacement');
				expect(csp.directives).toStrictEqual({
					'default-src': [ UNSAFE_EVAL, 'existing-replacement' ],
				});
			});
			test('replaces the first instance of either item or replacement and removes the latter', () => {
				const csp = new ContentSecurityPolicy({
					'default-src': [ 'existing-item', UNSAFE_EVAL, 'existing-replacement' ],
				}, { logger })
					.replace(DEFAULT_SRC, 'existing-item', 'existing-replacement');
				expect(csp.directives).toStrictEqual({
					'default-src': [ 'existing-replacement', UNSAFE_EVAL ],
				});
			});
		});
	});
});
