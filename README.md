Restricted Input
================

Allow restricted character sets in `input` elements.

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

## API

### options

| Key | Type | Description |
| --- | ---- | ----------- |
| element | `HTMLInputElement` or `HTMLTextAreaElement` | A valid reference to an `input` or `textarea` DOM node |
| pattern | `RegExp` | A [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) describing the allowed character set you wish for entry into corresponding field. |

## Browser Support

**Desktop**

- Chrome (latest)
- Firefox (17+)
- Safari (8+)
- IE11 (desktop/metro)
- IE10 (desktop/metro)
- IE9

## TODO

- [ ] Improve jsdoc
- [ ] Add example guides/pages
