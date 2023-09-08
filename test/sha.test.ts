import {
	describe,
	expect,
	test
} from '@jest/globals';
import { sha256, sha384, sha512 } from '../src';


describe('lib', () => {
	describe('csp', () => {
		describe('sha256', () => {
			test('prefixed with sha256-', () => {
				expect(sha256('foo')).toBe("'sha256-foo'");
			});
		});
		describe('sha384', () => {
			test('prefixed with sha384-', () => {
				expect(sha384('foo')).toBe("'sha384-foo'");
			});
		});
		describe('sha512', () => {
			test('prefixed with sha512-', () => {
				expect(sha512('foo')).toBe("'sha512-foo'");
			});
		});
	});
});
