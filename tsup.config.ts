import type { Options as TsupOptions} from 'tsup';
import { globSync } from 'glob';
import { defineConfig } from 'tsup';


export interface Options extends TsupOptions {
	d?: string
}


const TS_FILES = globSync(`./src/**/*.ts`, {
	absolute: false,
	// ignore: []
}).map(dir => dir.replace(/\\/g,'/'));


export default defineConfig((options: Options) => {
	if (options.d === 'dist/cjs') {
		return {
			entry: TS_FILES,
			format: 'cjs',
			minify: false,
			platform: 'neutral',
			target: 'es5',
			sourcemap: false,
		};
	} else if (options.d === 'dist/esm') {
		return {
			entry: TS_FILES,
			format: 'esm',
			minify: false,
			outExtension() {
				return {
					js: '.mjs'
				}
			},
			platform: 'neutral',
			target: 'es2015',
			splitting: false, // avoid chunk files
			sourcemap: false,
		};
	}
	throw new Error(`Unconfigured directory:${options.d}!`)
});
