react-ghost-i18n
================

Ghost I18n is a ReactJs component to augment existing react components with non-intrusive internationalization.

Installation
------------

If you are using react directly in the browser, you can download [react-ghost-i18n.min.js](https://raw.github.com/pzavolinsky/react-i18n/master/dist/react-ghost-i18n.min.js) and include it in you page:

```html
<script src="https://fb.me/react-0.13.3.js"></script>
<script src="react-ghost-i18n.min.js"></script>
```

If you are using CommonJS, just use npm:

```
npm install react-ghost-i18n
```

and then, in your scripts:
```javascript
var I18n = require('react-ghost-i18n');
```

Usage
-----

To use the I18n component, just add (or `require`) [react-ghost-i18n.min.js](https://raw.github.com/pzavolinsky/react-i18n/master/dist/react-ghost-i18n.min.js) before any other component in your compilation pipeline and check the console for missing translation warnings.


Motivation
----------

So you've been writing this React component for a couple of days now. And even though you try your best to ignore it, you cannot shake the feeling that every string you hardcode in your component brings you a little bit closer to the Dark Side.

So fearing that if you keep down this road you'll become full Sith, you google for react internationalization alternatives like crazy.

Unfortunately, even though there are many very good and extremely powerful options out there (e.g. formatjs), they require quite a lot of changes to the code and bureaucracy comparable only with an intergalactic government.

Clearly you don't want to (or cannot) change all your components right now. And even if you could, the final product would be riddled with strange tags like `<FormattedMessage />` making it harder to maintain.

Wouldn't it be great if you could gain all the internationalization benefits without sacrificing your Jedi nimbleness?

The aim of this project is to non-intrusively add internationalization to existing components with very little or no changes to the existing code.

In other words, the idea is that by using `<I18n>` you can keep happily hardcoding your messages and worry about translations later. In some cases you could even translate somebody else's components (e.g. third-party libraries) without changing their code.


Usage revisited
---------------

By default `<I18n>` will monkypatch `React.createClass` to wrap your components in an `<I18n>`. The `<I18n>` component in turn will recursively translate all the texts of its children components. This means that just by including [react-ghost-i18n.min.js](https://raw.github.com/pzavolinsky/react-i18n/master/dist/react-ghost-i18n.min.js) before any other component in the app, you'll gain full localization with minimal effort.

Alternatively, you could opt-out of this implicit translation behavior on a per-component basis by adding the `no18n` flag:

```js
var MyComponent = React.createClass({
  noI18n: true,
  ...
});
```

Or, if you prefer, you could opt-out globally, by calling `I18n.optOut()` before any call to `React.createClass`:

```js
I18n.optOut();
var MyComponent = React.createClass({
  ...
});
```

Note that if you opt-out of the implicit behavior but you still want translations, you'll have to manually wrap your components in a `<I18n>` (plenty of examples in [test.jsx](https://raw.github.com/pzavolinsky/react-i18n/master/src/test.jsx)).

Configuration
-------------

The configuration settings are:
- `locale`: must be an object with texts as keys and translations as values. This can also be a function that takes a string and returns the translation.
- `prefix`: a string that will be prepended to the text before searching for a translation.
- `warn`: the function that will be used to emit warnings (e.g. missing translation).

You can configure `<I18n>` by setting properties in the global `I18n` object (useful for implicit behavior):
```js
I18n.locale = { 'Hello, World!': 'Hola, Mundo!' }
```

Or by passing props to an `<I18n>` instance:
```js
<I18n i18n={ locale: { 'Hello, World!': 'Hola, Mundo!' } }>Hello, World!</I18n>
```

Or directly:
```js
<I18n locale={ 'Hello, World!': 'Hola, Mundo!' }>Hello, World!</I18n>
```

If both are supplied, instance props get priority (in the order listed above).

Examples
--------

Assuming the following translations:

```js
I18n.locale = {
  'Hello, World!': 'Hola, Mundo!',
  'This text is {0}!': 'Este texto está en {0}!',
  'bold': 'negrita',
  'Write some text here': 'Escribí un texto acá',
  'Hover over me': 'Mové el mouse sobre mi',
  'Great!': 'Genial!',
  'I\'m a button input': 'Soy un input botón',
  'I\'m a submit input': 'Soy un input submit',
  '{0}/{1}/{2}': '{1}/{0}/{2}'
};

```

Some translation examples are:

| JSX  | Renders to |
|----- |------------|
| `Hello, World!` (implicit) | `<span>Hola, Mundo!</span>` |
| `<I18n>Hello, World!</I18n>` | `<span>Hola, Mundo!</span>` |
| `<I18n>This text is <b>bold</b>!</I18n>` | `<span>Este texto está en <b>negrita</b>!</span>` |
| `<I18n><input placeholder="Write some text here" /></I18n>` | `<span><input placeholder="Escribí un texto acá" /></span>` |
| `<I18n><span title="Great!">Hover over me</span></I18n>` | `<span><span title="Genial!">Mové el mouse sobre mi</span></span>` |
| `<I18n><input type="button" value="I'm a button input" /></I18n>` | `<span><input type="button" value="Soy un input botón" /></span>` |
| `<I18n><input type="submit" value="I'm a submit input" /></I18n>` | `<span><input type="button" value="Soy un input submit" /></span>` |

See [test.jsx](https://raw.github.com/pzavolinsky/react-i18n/master/src/test.jsx) for more examples.

Demo
----

Click [here](http://pzavolinsky.github.io/react-ghost-i18n/).
