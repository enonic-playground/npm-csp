import {
	describe,
	expect,
	test
} from '@jest/globals';
import { q } from '../src';


describe('lib', () => {
	describe('csp', () => {
		describe('q', () => {
			test('wraps with single quotes', () => {
				expect(q('foo')).toBe("'foo'");
			});
		});
	});
});
