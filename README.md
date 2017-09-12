Restricted Input
================

Allow restricted character sets in `input` elements.

## Demo

Try the latest version of Restricted Input [here](https://braintree.github.io/restricted-input/).

## Features

- Disallow arbitrary chars based on patterns
- Maintains caret position
- Format/Update on paste
- Works in IE9+

## Development

**Install dependencies**

```bash
$ npm i
```

**Watch files and run server**

```bash
$ npm run development
```

This will start a server on port `3099` which can be overridden with the `PORT` env var.

**Run tests**

There are unit tests:

```bash
$ npm t
```

## Usage

```javascript
import RestrictedInput from 'restricted-input';

const formattedCreditCardInput = new RestrictedInput({
  element: document.querySelector('#credit-card'),
  pattern: '{{9999}} {{9999}} {{9999}} {{9999}}'
});
```

## Patterns

Patterns are a mixture of [`Placeholder`](#placeholder)s and [`PermaChar`](#permachar)s.

### Placeholder

A `Placeholder` is the part of the pattern that accepts user input based on some restrictions. A placeholder is defined in the pattern using two open curly brackets, the placeholder, followed by two closing curly brackets e.g. `{{Abc123}}`.

The patterns a `Placeholder` can be are:
 - a single alpha character that matches the alpha regex `/[A-Za-z]/`. e.g. `{{C}}` will match one alpha character.
 - a single digit that matches the digit regex `/[0-9]/`. e.g. `{{3}}` will match one digit.
 - a `*` character that matches `/./`. e.g. `{{*}}` will match the next character.

### PermaChar

A `PermaChar` is the part of the pattern that is automatically inserted. `PermaChar`s are defined in the pattern as any characters other than `Placeholder`s.

### Example patterns

Some example patterns with behavior are listed:
 - `12{{3}}`
   - Inserts `12`.
   - Waits for a single digit from the user.
 - `{{A}}BC`
   - Waits for a single alpha from the user.
   - Inserts `BC`.
 - `${{*2L}}E`
   - Inserts `$`.
   - Waits for any single character input from the user.
   - Waits for a single digit from the user.
   - Waits for a single alpha from the user.
   - Inserts `E`.

## API

### options

| Key | Type | Description |
| --- | ---- | ----------- |
| element | `HTMLInputElement` or `HTMLTextAreaElement` | A valid reference to an `input` or `textarea` DOM node |
| pattern | `String` | Pattern describing the allowed character set you wish for entry into corresponding field. See [Patterns](#patterns).|

## Browser Support

**Desktop**

- Chrome (latest)
- Firefox (17+)
- Safari (8+)
- IE11 (desktop/metro)
- IE10 (desktop/metro)
- IE9

## Browsers Where Formatting is Turned Off Automatically

Old versions of Samsung Android browsers are incompatible with formatting. These will not attempt to intercept the values and format the input.

## TODO

- [ ] Improve jsdoc
- [ ] Add example guides/pages
