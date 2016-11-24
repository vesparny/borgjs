<a name="2.0.1"></a>
## [2.0.1](https://github.com/vesparny/borgjs/compare/2.0.0...v2.0.1) (2016-11-24)


### Bug Fixes

* **lib:** Check that config file exists ([b17ca4c](https://github.com/vesparny/borgjs/commit/b17ca4c))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/vesparny/borgjs/compare/1.2.1...v2.0.0) (2016-11-09)


### Features

* **lib:** Add support for arbitrary borg options ([c1757f8](https://github.com/vesparny/borgjs/commit/c1757f8))
* **lib:** Allow to set any environment variable via config ([89d0f5c](https://github.com/vesparny/borgjs/commit/89d0f5c))
* **lib:** Improve filelock handling by exiting the process if a lockfile exists and it's in use ([8d8f5a5](https://github.com/vesparny/borgjs/commit/8d8f5a5))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/vesparny/borgjs/compare/1.2.0...v1.2.1) (2016-10-25)


### Reverts

* **lib:** Revert back the creation of tmp folder for filelock ([595a4b9](https://github.com/vesparny/borgjs/commit/595a4b9))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/vesparny/borgjs/compare/1.1.3...v1.2.0) (2016-10-25)


### Features

* **lib:** Log verbose output for check command ([353d606](https://github.com/vesparny/borgjs/commit/353d606))



<a name="1.1.3"></a>
## [1.1.3](https://github.com/vesparny/borgjs/compare/1.1.2...v1.1.3) (2016-10-25)


### Bug Fixes

* **lib:** Fix prune command ([d97129f](https://github.com/vesparny/borgjs/commit/d97129f))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/vesparny/borgjs/compare/1.1.1...v1.1.2) (2016-10-24)


### Bug Fixes

* **lib:** Remove exit hook ([4f0e32e](https://github.com/vesparny/borgjs/commit/4f0e32e))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/vesparny/borgjs/compare/1.1.0...v1.1.1) (2016-10-24)


### Bug Fixes

* **lib:** Fix broken build ([215474a](https://github.com/vesparny/borgjs/commit/215474a))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/vesparny/borgjs/compare/1.0.0...v1.1.0) (2016-10-24)


### Features

* **lib:** Allow to specify an archive filename and log only to stdout ([b325244](https://github.com/vesparny/borgjs/commit/b325244))



<a name="1.0.0"></a>
# 1.0.0 (2016-10-20)


### Bug Fixes

* **lib:** Remove check for borg in path ([b1e8f49](https://github.com/vesparny/borgjs/commit/b1e8f49))


### Features

* **lib:** Initial commit ([f4cad37](https://github.com/vesparny/borgjs/commit/f4cad37))
* **notifications:** Add pushbullet support ([921c316](https://github.com/vesparny/borgjs/commit/921c316))
