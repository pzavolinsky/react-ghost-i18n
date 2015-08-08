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
<I18n><SomeVeryComplexCompoment ... /></I18n>
```

Note that `<I18n>` applies a recursive translation strategy. This means that wrapping the whole ReactJs app in an `<I18n>` is a perfectly viable strategy to add translations to the whole app.
