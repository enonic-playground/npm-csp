import { Keyword }	from './Keyword';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { values } from '@enonic/js-utils/object/values';


export function isKeyword(keyword: string): keyword is Keyword {
	return arrayIncludes(values(Keyword), keyword as Keyword);
}
