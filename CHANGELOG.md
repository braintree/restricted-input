# Restricted Input - Release Notes

## UNRELEASED

* Fix LastPass autofill bug

## 1.2.3 (2017-06-01)

* Use scoped version of browser-switch dependency

## 1.2.2 (2017-06-01)

* Fix Chrome Autofill to format the input correctly

## 1.2.1 (2017-05-24)

* Update browser detection lib

## 1.2.0 (2017-04-08)

* Fix issue where restricted input could not be required in a server context
* Provide supports-input-formatting as a standalone file

## 1.1.0 (2017-04-04)

* Provide specific strategy for Android KitKat Chromium based webviews. Fixes issue where only 4 characters could be input
* Provide helper method for determining if the browser supports formatting

## 1.0.11 (2017-02-22)

* Correct detection of Samsung browsers to disable formatting in old versions

## 1.0.10 (2017-02-14)

* Fix formatting when using 1Password autofill

## 1.0.9 (2017-01-25)

* Disable restricted input in the Samsung Browser

## 1.0.8 (2017-01-18)

* Fix for Samsung keyboards reporting a ranged selection on first character input

## 1.0.7 (2016-12-16)

* Fix for Samsung keyboards not selecting input correctly after a permacharacter insertion on Android Chrome

## 1.0.6 (2016-12-12)

* Fix for third party keyboards on Android Chrome

## 1.0.5 (2016-11-15)

* Fix iOS Safari autocomplete issue

## 1.0.4 (2016-11-04)

* Fix Safari autocomplete issue

## 1.0.3 (2016-09-28)

* Fix IE9 stuttering when formatting inputs

## 1.0.2 (2016-09-16)

* Fix iOS stuttering when formatting inputs

## 1.0.1 (2016-08-30)

* Remove deprecated `keyIdentifier` check
* Optimize RegExp creation

## 1.0.0 (2016-05-27)

* Initial public release of restricted-input
