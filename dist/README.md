
# llcacodec Distribution

Here lies the compiled and distributed files of llcacodec. Usually, llcacodec
will be distributed with npm, and therefore this document should be largely
irrelevant for most, as npm does all of the heavy lifting.

> **Note for developers and contributors:**
>
> These files should NEVER be modified directly, and will be created through
> the build script in package.json. Additionally, contributors should NOT run
> the build scripts, esbuild, or the typescript compiler to create and commit
> these files, as to prevent merge conflicts. Contributors are able encouraged
> to compile their code for testing, but should not commit any new compiled files
> to the dist/ directory, even if a new source file was created.

Note that despite being in the dist/ directory, the minified distributions and this README document
are not downloaded when llcacodec is installed through npm, as this document mostly serves to explain
different distribution formats of llcacodec.

## Minified Distributions

llcacodec can also come in 3 minified distributions which can be copy and
pasted into projects. These distributions include llcacodec.bundle.min.js
for browsers, llcacodec.min.cjs for CommonJS modules, and llcacodec.min.mjs
for ES modules. Additionally, each file has a source map that can be copied,
which would allow for easier printing of error messages and stack traces by
browsers and nodejs whenever an error occurs.

## llcacodec.bundle.min.js and llcacodec.bundle.min.js.map - Browsers

llcacodec minfied and compiled to be used in non-type="module" browser script tags.
The user can simply paste llcacodec.bundle.min.js into their website, import the
script as ```<script src="llcacodec.bundle.min.js" />```, and use the library
through the global "llcacodec" object that will be created by the script tag. This
global object will have all public API functions of llcacodec, including,
but not limited to, **readLifeString**, **writeLifeString**, **readLifeRule**, and
**writeLifeRule**. All functions can be checked by using ```console.log(llcacodec)```

> Note that this script tag should be placed before any script tag where llcacodec is
> used, and the src attribute should point to wherever the llcacodec.bundle.min.js file
> is located. The example script tag simply assumes that the llcacodec.bundle.min.js file
> will be at the root of the website, however, if it is included somewhere like
> scripts/libs/llcacodec.bundle.min.js, then the import would accordingly be
> ```<script src="scripts/libs/llcacodec.bundle.min.js" />```

## llcacodec.min.cjs and llcacodec.min.cjs.map - CommonJS Modules

llcacodec minified and compiled to be used with the CommonJS module system.
Additionally, I've found that llcacodec.min.cjs also works with ES module import
statements in nodejs, so this could be used as a general file for all imports for nodejs.
However, for convention's and transparency's sake, I've chosen
to end llcacodec.min.cjs with .cjs.

## llcacodec.min.mjs and llcacodec.min.mjs.map - ES Modules

llcacodec minified and compiled to be used with the ES module system. This is
best for running on browsers in scripts where
```<script src="llcacodec.min.mjs" type="module" ></script>``` is used.

> If the user would prefer a minified version for nodejs, both llcacodec.min.cjs and
> llcacodec.min.mjs could be used with ES modules in nodejs. However, llcacodec.min.cjs
> CANNOT be used in the browser, but llcacodec.min.mjs could be used in the browser as a module.
> Additionally, llcacodec.min.mjs CANNOT be used with CommonJS modules, but llcacodec.min.cjs CAN
> be used with ES modules.
