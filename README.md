# Content Security Policy Utilities

## Usage

Install with npm

	npm i @enonic/csp

```typescript
import {
	NONE,
	SCRIPT_SRC,
	UNSAFE_INLINE,
	ContentSecurityPolicy,
	type ContentSecurityPolicyLogger,
	sha256
} from '@enonic/csp';

const csp = new ContentSecurityPolicy({
	'default-src': [NONE],
	'script-src': [NONE]
}, {
	logger: console
})
	.remove(SCRIPT_SRC, NONE)
	.append(SCRIPT_SRC, UNSAFE_INLINE);

const cspHeaderString = csp.toString();

const headers = {
	'content-security-policy': cspHeaderString;
};

const cspToModify = ContentSecurityPolicy.parse(cspHeaderString)
	.replace(SCRIPT_SRC, UNSAFE_INLINE, nonce(randomString))
	.prepend(SCRIPT_SRC, sha256(sha256sumString));

const betterHeaders = {
	'content-security-policy': cspToModify.toString();
};
```

## Release

````
git tag vX.Y.Z
git push origin vX.Y.Z
````

This will trigger release & publish on NPM.
