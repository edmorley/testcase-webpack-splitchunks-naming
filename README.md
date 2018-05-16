## STR:

1. Clone this repo
2. `yarn install`
3. `yarn build`

## Expected:

Since `splitChunks.maxInitialRequests: 5`, there are no more than five files for each entrypoint (including the entrypoint itself) that contain the name of the entrypoint.

## Actual:

There are 6 files containing the string `index`:

```
$ ls -1 dist/*index*
dist/index.js
dist/index~logviewer~perf.js
dist/vendors~index.js
dist/vendors~index~logviewer~perf.js
dist/vendors~index~logviewer~perf~userguide.js
dist/vendors~index~perf.js
```

...and similarly, 6 containing the string `perf`:

```
$ ls -1 dist/*perf*
dist/index~logviewer~perf.js
dist/perf.js
dist/vendors~index~logviewer~perf.js
dist/vendors~index~logviewer~perf~userguide.js
dist/vendors~index~perf.js
dist/vendors~perf.js
```

However the build output only lists 5 files for each:

```
Entrypoints:

  index (937 KiB)
      vendors~index~logviewer~perf~userguide.js
      vendors~index~logviewer~perf.js
      vendors~index~perf.js
      vendors~index.js
      index.js

  perf (742 KiB)
      vendors~index~logviewer~perf~userguide.js
      vendors~index~logviewer~perf.js
      vendors~index~perf.js
      vendors~perf.js
      perf.js
```

The file missing from above is `index~logviewer~perf.js`, which is only listed under the `logviewer` entrypoint:

```
  logviewer (591 KiB)
      vendors~index~logviewer~perf~userguide.js
      vendors~index~logviewer~perf.js
      index~logviewer~perf.js
      logviewer.js
```

Inspecting the generated output using `BundleAnalyzerPlugin` shows that the `index~logviewer~perf.js` file's content is repeated inside `index.js` and `perf.js`.

As such, my hunch is that due to `maxInitialRequests`, the extra chunk wasn't able to be used by `index.js` and `perf.js` (so the content duplicated in them), but that the naming function didn't adjust the name of `index~logviewer~perf.js` to no longer reference those page names (ie change it back to just `logviewer`).

This means that `index~logviewer~perf.js` is only referenced by one entrypoint (`logviewer`), but yet is in it's own shared chunk, thereby not adhering to the `minChunks: 2` requirement.

The full build output is:

```
testcase-webpack-splitchunks-naming $ yarn build
yarn run v1.6.0
(node:4376) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
$ webpack
clean-webpack-plugin: C:\Users\Ed\src\testcase-webpack-splitchunks-naming\dist has been removed.
Hash: 578af10f8f40529aee2f
Version: webpack 4.8.3
Time: 1961ms
Built at: 2018-05-16 21:58:12
                                    Asset      Size  Chunks                    Chunk Names
vendors~index~logviewer~perf~userguide.js   174 KiB       0  [emitted]         vendors~index~logviewer~perf~userguide
          vendors~index~logviewer~perf.js   397 KiB       1  [emitted]  [big]  vendors~index~logviewer~perf
                    vendors~index~perf.js   119 KiB       2  [emitted]         vendors~index~perf
                  index~logviewer~perf.js  13.5 KiB       3  [emitted]         index~logviewer~perf
                          vendors~perf.js  36.5 KiB       4  [emitted]         vendors~perf
                         vendors~index.js   218 KiB       5  [emitted]         vendors~index
                             userguide.js  1.27 KiB       6  [emitted]         userguide
                             logviewer.js   7.1 KiB       7  [emitted]         logviewer
                                  perf.js  16.4 KiB    8, 3  [emitted]         perf
                                 index.js  30.3 KiB    9, 3  [emitted]         index
Entrypoint index [big] = vendors~index~logviewer~perf~userguide.js vendors~index~logviewer~perf.js vendors~index~perf.js vendors~index.js index.js
Entrypoint perf [big] = vendors~index~logviewer~perf~userguide.js vendors~index~logviewer~perf.js vendors~index~perf.js vendors~perf.js perf.js
Entrypoint logviewer [big] = vendors~index~logviewer~perf~userguide.js vendors~index~logviewer~perf.js index~logviewer~perf.js logviewer.js
Entrypoint userguide = vendors~index~logviewer~perf~userguide.js userguide.js
  [0] ./src/js/treeherder.js 274 bytes {3} {8} {9} [built]
  [4] ./src/js/constants.js 12.4 KiB {3} {8} {9} [built]
  [5] ./src/js/services/taskcluster.js 1.73 KiB {3} {8} {9} [built]
  [8] ./src/helpers/urlHelper.js + 2 modules 6.22 KiB {3} {8} {9} [built]
      | ./src/helpers/urlHelper.js 5.23 KiB [built]
      | ./src/helpers/locationHelper.js 220 bytes [built]
      | ./src/helpers/revisionHelper.js 789 bytes [built]
 [10] ./src/partials/main/tcjobactions.html 1.95 KiB {3} {8} {9} [built]
 [18] ./src/helpers/jobHelper.js 4.58 KiB {7} {9} [built]
 [23] ./src/js/filters.js 2.09 KiB {3} {8} {9} [built]
 [28] ./src/js/services/tcactions.js 5.8 KiB {3} {8} {9} [built]
 [37] ./src/js/services/main.js 4.59 KiB {7} {8} [built]
 [68] ./src/partials/main/intermittent.html 5.26 KiB {9} [built]
 [72] ./src/entry-userguide.js + 1 modules 515 bytes {6} [built]
      | ./src/entry-userguide.js 25 bytes [built]
      | ./src/js/userguide.js 485 bytes [built]
 [73] ./src/entry-perf.js + 2 modules 1.74 KiB {8} [built]
      | ./src/entry-perf.js 169 bytes [built]
      | ./src/js/perf.js 401 bytes [built]
      | ./src/js/models/option_collection.js 1.13 KiB [built]
 [74] ./src/entry-logviewer.js + 2 modules 11.9 KiB {7} [built]
      | ./src/entry-logviewer.js 170 bytes [built]
      | ./src/js/logviewer.js 1.11 KiB [built]
      | ./src/js/controllers/logviewer.js 10.6 KiB [built]
 [75] ./src/entry-index.js + 2 modules 31.5 KiB {9} [built]
      | ./src/entry-index.js 139 bytes [built]
      | ./src/js/treeherder_app.js 2.25 KiB [built]
      | ./src/plugins/controller.js 29 KiB [built]
[151] (webpack)/buildin/module.js 519 bytes {1} [built]
    + 146 hidden modules

WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets:
  vendors~index~logviewer~perf.js (397 KiB)

WARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:
  index (937 KiB)
      vendors~index~logviewer~perf~userguide.js
      vendors~index~logviewer~perf.js
      vendors~index~perf.js
      vendors~index.js
      index.js
  perf (742 KiB)
      vendors~index~logviewer~perf~userguide.js
      vendors~index~logviewer~perf.js
      vendors~index~perf.js
      vendors~perf.js
      perf.js
  logviewer (591 KiB)
      vendors~index~logviewer~perf~userguide.js
      vendors~index~logviewer~perf.js
      index~logviewer~perf.js
      logviewer.js


WARNING in webpack performance recommendations:
You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.
For more info visit https://webpack.js.org/guides/code-splitting/
```
