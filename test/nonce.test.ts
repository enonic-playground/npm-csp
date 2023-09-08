import {
	describe,
	expect,
	test
} from '@jest/globals';
import { nonce } from '../src';


describe('lib', () => {
	describe('csp', () => {
		describe('nonce', () => {
			test('prefixed with nonce-', () => {
				expect(nonce('foo')).toBe("'nonce-foo'");
			});
		});
	});
});
