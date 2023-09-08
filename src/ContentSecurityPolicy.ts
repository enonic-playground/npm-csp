import type {
	Directive,
	Directives
} from './Directive';


import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { toStr } from '@enonic/js-utils/value/toStr';
import { entries } from '@enonic/js-utils/object/entries';
import { forceArray } from '@enonic/js-utils/array/forceArray';
import { isDirective } from './isDirective';
import { Keyword } from './Keyword';
import { normalizeDirectiveValue } from './normalizeDirectiveValue';

// https://www.w3.org/TR/CSP3/#framework-infrastructure
// ascii-whitespace %x09 / %x0A / %x0C / %x0D / %x20
//
// https://www.rfc-editor.org/rfc/rfc5234
// HTAB = %x09 ; horizontal tab ; \t
// LF = %x0A ; linefeed ; \n
// FF = %x0C ; form feed ; \f
// CR = %x0D ; carriage return ; \r
// SP = %x20 ; space ; ' '

// https://www.w3.org/TR/CSP3/#parse-serialized-policy
// NOTE: Directive names are case-insensitive, that is: script-SRC 'none' and ScRiPt-sRc 'none' are equivalent.

export interface ContentSecurityPolicyLogger {
	// debug: Console['debug']
	// error: Console['error']
	warn: Console['warn']
}

const DEFAULT_LOGGER: ContentSecurityPolicyLogger = {
	// debug: () => {},
	// error: () => {},
	warn: () => {},
}

export class ContentSecurityPolicy {
	directives: Directives = {};
	logger: ContentSecurityPolicyLogger;

	static parse(cspString: string, {
		logger = DEFAULT_LOGGER
	}: {
		logger?: ContentSecurityPolicyLogger
	} = {}) {
		const csp = new ContentSecurityPolicy();
		cspString.split(';').forEach(directiveString => {
			const [directive, ...values] = directiveString.trim().split(/[ \t\n\r\f]+/); // split on ascii-whitespace
			if (directive !== '') { // Handle empty splits ;;;
				const lcDirective = directive.toLowerCase();
				if (!isDirective(lcDirective)) {
					logger.warn(`Skipping Unsupported directive: "%s"!`, directive);
				} else {
					csp.append(lcDirective, values);
				}
			}
		});
		return csp;
	}

	constructor(directives: Directives = {}, {
		logger = DEFAULT_LOGGER
	}: {
		logger?: ContentSecurityPolicyLogger
	} = {}) {
		this.logger = logger;
		entries(directives).forEach(([directive, values]) => {
			const lcDirective = String(directive).toLowerCase();
			if (!isDirective(lcDirective)) {
				this.logger.warn(`Skipping Unsupported directive: "%s"!`, directive);
			} else {
				const normalizedValues: string[] = [];
				forceArray(values as string[]).forEach(
					v => v.split(/[ \t\n\r\f]+/)
						.forEach(v => normalizedValues.push(normalizeDirectiveValue(v)))
				); // split on ascii-whitespace
				this.directives[lcDirective] = normalizedValues;
			}
		});
	}

	// https://infra.spec.whatwg.org/#ordered-set
	// To append to an ordered set:
	// if the set contains the given item, then do nothing;
	// otherwise, perform the normal list append operation.
	append(directive: Directive, value: string|string[]) {
		const lcDirective = directive.toLowerCase();
		if (!isDirective(lcDirective)) {
			this.logger.warn(`Unsupported directive: "%s"!`, directive);
			return this;
		}
		if(!this.directives[lcDirective]) {
			this.directives[lcDirective] = [];
		}
		const valueArray = forceArray(value);
		valueArray.forEach(v => {
			const normalizedValue = normalizeDirectiveValue(v);
			if (!arrayIncludes(this.directives[lcDirective] as string[], normalizedValue)) {
				(this.directives[lcDirective] as string[]).push(normalizedValue);
			}
		});
		return this.checkDirective(directive);
	} // append

	// To prepend to an ordered set:
	// if the set contains the given item, then do nothing;
	// otherwise, perform the normal list prepend operation.
	prepend(directive: Directive, value: string|string[]) {
		const lcDirective = directive.toLowerCase();
		if (!isDirective(lcDirective)) {
			this.logger.warn(`Unsupported directive: "%s"!`, directive);
			return this;
		}
		if(!this.directives[lcDirective]) {
			this.directives[lcDirective] = [];
		}
		this.directives[lcDirective] = forceArray(value).filter(v => {
			const normalizedValue = normalizeDirectiveValue(v);
			return !arrayIncludes(this.directives[lcDirective] as string[], normalizedValue);
		}).concat(this.directives[lcDirective] as string[]);
		return this.checkDirective(directive);
	} // prepend

	remove(directive: Directive, value: string|string[]) {
		const lcDirective = directive.toLowerCase();
		if (!isDirective(lcDirective)) {
			this.logger.warn(`Unsupported directive: "%s"!`, directive);
			return this;
		}
		if(!this.directives[lcDirective]) {
			return this;
		}
		const values = forceArray(value);
		for (let i = 0; i < values.length; i++) {
			const normalizedValue = normalizeDirectiveValue(values[i]);
			this.directives[lcDirective] = (this.directives[lcDirective] as string[]).filter(v => v !== normalizedValue);
		} // for
		return this;
	} // remove

	// To replace within an ordered set set, given item and replacement:
	// if set contains item or replacement,
	// then replace the first instance of either with replacement and remove all other instances.
	replace(directive: Directive, item: string, replacement: string) {
		const lcDirective = directive.toLowerCase();
		if (!isDirective(lcDirective)) {
			this.logger.warn(`Unsupported directive: "%s"!`, directive);
			return this;
		}
		if(!this.directives[lcDirective]) {
			return this;
		}

		const normalizedItem = normalizeDirectiveValue(item);
		const normalizedReplacement = normalizeDirectiveValue(replacement);

		// find index of first item or replacement
		const itemIndex = (this.directives[lcDirective] as string[]).indexOf(normalizedItem); // Can be -1
		const replacementIndex = (this.directives[lcDirective] as string[]).indexOf(normalizedReplacement); // Can be -1
		if (itemIndex === -1 && replacementIndex === -1) {
			this.logger.warn(`Neither item nor replacement found in directive "%s"!`, directive);
			return this;
		}
		const minIndex = itemIndex === -1
			? replacementIndex
			: replacementIndex === -1
				? itemIndex
				: Math.min(itemIndex, replacementIndex);

		// replace first instance of either (item or replacement) with replacement
		(this.directives[lcDirective] as string[])[minIndex] = normalizedReplacement;

		// remove the other instance of either (item or replacement)
		const otherIndex = itemIndex === minIndex ? replacementIndex : itemIndex;
		if (otherIndex !== -1) {
			(this.directives[lcDirective] as string[]).splice(otherIndex, 1);
		}

		return this.checkDirective(directive);
	} // replace

	// The intersection of ordered sets A and B,
	// is the result of creating a new ordered set set and,
	// for each item of A, if B contains item, appending item to set.
	// TODO: implement intersection?

	// The union of ordered sets A and B,
	// is the result of cloning A as set and,
	// for each item of B, appending item to set.
	// TODO: implement union?

	toString() {
		return entries(this.directives)
			.map(([directive, values]) => `${String(directive)} ${(values as string[]).join(' ')}`)
			.join('; ');
	} // toString

	checkDirective(directive: Directive) {
		const lcDirective = directive.toLowerCase() as Directive;
		if (
			Array.isArray(this.directives[lcDirective])
			&& (this.directives[lcDirective] as string[]).length > 1
			&& arrayIncludes(this.directives[lcDirective] as string[], Keyword.NONE)
		) {
			this.logger.warn(`Directive "%s" is illegal! it contains 'none' and other values! %s`, lcDirective, toStr(this.directives[lcDirective]));
		}
		return this;
	}

} // ContentSecurityPolicy
