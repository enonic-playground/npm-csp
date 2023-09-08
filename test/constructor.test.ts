import {
	describe,
	expect,
	test
} from '@jest/globals';
import {
	NONE,
	ContentSecurityPolicy,
	type ContentSecurityPolicyLogger
} from '../src';


const logger: ContentSecurityPolicyLogger = {
	warn: () => {},
}


describe('lib', () => {
	describe('csp', () => {
		describe('constructor', () => {
			test('handles no directives object', () => {
				const csp = new ContentSecurityPolicy();
				expect(csp.directives).toStrictEqual({});
			});
			test('handles empty directives object', () => {
				const directives = {};
				const csp = new ContentSecurityPolicy(directives, { logger });
				expect(csp.directives).toStrictEqual({});
			});
			test('handles directives object', () => {
				const directives = {
					'default-src': [ NONE ],
				};
				const csp = new ContentSecurityPolicy(directives, { logger });
				expect(csp.directives).toStrictEqual({
					'default-src': [ NONE ],
				});
			});
			test('skips unsupported directives', () => {
				const directives = {
					'fnord-src': [ NONE ],
				};
				// @ts-expect-error
				const csp = new ContentSecurityPolicy(directives, { logger });
				expect(csp.directives).toStrictEqual({});
			});
		});
	});
});
