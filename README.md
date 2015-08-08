react-i18n
==========

I18n is ReactJs component to augment existing react components with non-intrusive internationalization.

Installation
------------

For now just grab [i18n.jsx](https://raw.github.com/pzavolinsky/react-i18n/master/i18n.jsx).

Usage
-----

To use the I18n component, just wrap your existing component in an `<I18n>` and check the console for missing translation warnings.

For example:
```html
<I18n>Some text <SomeCompoment />, more text, etc.</I18n>
```

Examples:
---------
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
| `<I18n>Hello, World!</I18n>` | `<span>Hola, Mundo!</span>` |
| `<I18n>This text is <b>bold</b>!</I18n>` | `<span>Este texto está en <b>negrita</b>!</span>` |
| `<I18n><input placeholder="Write some text here" /></I18n>` | `<span><input placeholder="Escribí un texto acá" /></span>` |
| `<I18n><span title="Great!">Hover over me</span></I18n>` | `<span><span title="Genial!">Mové el mouse sobre mi</span></span>` |
| `<I18n><input type="button" value="I'm a button input" /></I18n>` | `<span><input type="button" value="Soy un input botón" /></span>` |
| `<I18n><input type="submit" value="I'm a submit input" /></I18n>` | `<span><input type="button" value="Soy un input submit" /></span>` |

See [app.jsx](https://raw.github.com/pzavolinsky/react-i18n/master/app.jsx) for more examples.

Demo
----

Click [here](http://pzavolinsky.github.io/react-i18n/).
