# Restricted Input - Release Notes

## 3.0.3

- Fix issue where pasting on Android Chrome would result in a double entry of the inputted value (Fixes [braintree-web-drop-in#650](https://github.com/braintree/braintree-web-drop-in/issues/650))

## 3.0.2

- Fixup usage of window for server-side rendering

## 3.0.1

- Add missing `supports-input-formatting` module at top level

## 3.0.0

- Add Typescript types

**Breaking Changes**

Private methods in Restricted Input are now private

## 2.1.1

- convert global to window (closes braintree-web#401)

## 2.1.0

- Add option to include a hook for the unformatted value of the input after pasting

## 2.0.2

- Update browser-detection dependency to 1.8.0
- Add ChromeOS detection and treat it like Android (fixes issue with malformed formatting in chrome books with soft keyboards)

## 2.0.1

- Fix bug where input would be formatted when using `setPattern` even if input is empty

## 2.0.0

- Fix bug in iOS Chrome where autofill may not format correctly

_Breaking Changes_

- Inputs initialize in formatted state if input has a preset value

## 1.2.7 (2017-11-01)

- Fix bug where iOS inputs would not paste correctly

## 1.2.6 (2017-08-31)

- Add prepublish script to build file before publishing

## 1.2.5 (2017-07-07)

- Update browser-detection to latest major version

## 1.2.4 (2017-06-02)

- Fix LastPass autofill bug

## 1.2.3 (2017-06-01)

- Use scoped version of browser-switch dependency

## 1.2.2 (2017-06-01)

- Fix Chrome Autofill to format the input correctly

## 1.2.1 (2017-05-24)

- Update browser detection lib

## 1.2.0 (2017-04-08)

- Fix issue where restricted input could not be required in a server context
- Provide supports-input-formatting as a standalone file

## 1.1.0 (2017-04-04)

- Provide specific strategy for Android KitKat Chromium based webviews. Fixes issue where only 4 characters could be input
- Provide helper method for determining if the browser supports formatting

## 1.0.11 (2017-02-22)

- Correct detection of Samsung browsers to disable formatting in old versions

## 1.0.10 (2017-02-14)

- Fix formatting when using 1Password autofill

## 1.0.9 (2017-01-25)

- Disable restricted input in the Samsung Browser

## 1.0.8 (2017-01-18)

- Fix for Samsung keyboards reporting a ranged selection on first character input

## 1.0.7 (2016-12-16)

- Fix for Samsung keyboards not selecting input correctly after a permacharacter insertion on Android Chrome

## 1.0.6 (2016-12-12)

- Fix for third party keyboards on Android Chrome

## 1.0.5 (2016-11-15)

- Fix iOS Safari autocomplete issue

## 1.0.4 (2016-11-04)

- Fix Safari autocomplete issue

## 1.0.3 (2016-09-28)

- Fix IE9 stuttering when formatting inputs

## 1.0.2 (2016-09-16)

- Fix iOS stuttering when formatting inputs

## 1.0.1 (2016-08-30)

- Remove deprecated `keyIdentifier` check
- Optimize RegExp creation

## 1.0.0 (2016-05-27)

- Initial public release of restricted-input
