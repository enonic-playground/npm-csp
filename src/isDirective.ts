import { Directive } from './Directive';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { values } from '@enonic/js-utils/object/values';


export function isDirective(directive: string): directive is Directive {
	return arrayIncludes(values(Directive), directive as Directive);
}
