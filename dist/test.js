'use strict';

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

// ========================================================================== //
// Note that the default behavior is implicit translations (i.e. without
// an explicit <I18n> wrapper). To opt-out of this implicit behavior just
// call:
I18n.optOut();

var Test = React.createClass({
  displayName: 'Test',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'test' },
      React.createElement(
        'div',
        { className: 'title', 'i18n-disabled': true },
        this.props.title
      ),
      React.createElement(
        'div',
        { className: 'body' },
        this.props.children
      )
    );
  }
});

var NotTranslated1 = React.createClass({
  displayName: 'NotTranslated1',

  noI18n: true,
  render: function render() {
    return React.createElement(
      'span',
      null,
      'This is not translated'
    );
  }
});

var DontTranslate = { I18n: false };
var NotTranslated2 = React.createClass({
  displayName: 'NotTranslated2',

  mixins: [DontTranslate],
  render: function render() {
    return React.createElement(
      'span',
      null,
      'This is not translated'
    );
  }
});

var Func = function Func(_ref) {
  var children = _ref.children;
  return React.createElement(
    'b',
    null,
    children
  );
};
var WrappedFunc = I18n.wrap(function (_ref2) {
  var children = _ref2.children;
  return React.createElement(
    'b',
    null,
    children
  );
});

// ========================================================================== //
// To opt back in the implicit (default) behavior just call:
I18n.optIn();

// Components defined from now on will have implicit translations by default:
var ImplicitTest = React.createClass({
  displayName: 'ImplicitTest',

  render: function render() {
    return React.createElement(Test, this.props);
  }
});

// Note that you can still opt-out of translations on a per-component basis
// using the noI18n flag in React.createClass({ noI18n: true, ... }) a mixin
// like DontTranslate above.

// ========================================================================== //
setTimeout(function () {
  var content = React.createElement(
    'div',
    null,
    React.createElement(
      Test,
      { title: 'Simple example' },
      React.createElement(
        I18n,
        null,
        'Hello, World!'
      )
    ),
    React.createElement(
      Test,
      { title: 'Translate children' },
      React.createElement(
        I18n,
        null,
        'This text is ',
        React.createElement(
          'b',
          null,
          'bold'
        ),
        '!'
      )
    ),
    React.createElement(
      Test,
      { title: 'Translate properties' },
      React.createElement(
        I18n,
        null,
        React.createElement('input', { placeholder: 'Write some text here' }),
        React.createElement(
          'span',
          { title: 'Great!' },
          'Hover over me'
        ),
        React.createElement('input', { type: 'button', value: 'I\'m a button input' }),
        React.createElement('input', { type: 'submit', value: 'I\'m a submit input' })
      )
    ),
    React.createElement(
      Test,
      { title: 'Use a custom locale object' },
      React.createElement(
        I18n,
        { locale: { 'Custom': 'Personalizado' } },
        'Custom'
      )
    ),
    React.createElement(
      Test,
      { title: 'Use a custom locale function' },
      React.createElement(
        I18n,
        { locale: function locale(s) {
            return 'a';
          } },
        'It\'s always "a"'
      )
    ),
    React.createElement(
      Test,
      { title: 'Disable translations for some elements' },
      React.createElement(
        I18n,
        null,
        React.createElement(
          'div',
          null,
          'Hello, World!'
        ),
        React.createElement(
          'div',
          { 'i18n-disabled': true },
          'This is not translated'
        )
      )
    ),
    React.createElement(
      Test,
      { title: 'Use a custom warn function' },
      React.createElement(
        I18n,
        { warn: function warn(s) {
            console.log('custom log function: ' + s);
          } },
        'Translation for this text will be missing (check browser console).'
      )
    ),
    React.createElement(
      Test,
      { title: 'Go crazy (mm/dd/yyyy to dd/mm/yyyy)' },
      React.createElement(
        I18n,
        null,
        React.createElement(
          'span',
          null,
          '09'
        ),
        '/',
        React.createElement(
          'span',
          null,
          '12'
        ),
        '/',
        React.createElement(
          'span',
          null,
          '1900'
        )
      )
    ),
    React.createElement(
      Test,
      { title: 'Disabled by noI18n flag' },
      React.createElement(
        I18n,
        null,
        React.createElement(NotTranslated1, null)
      )
    ),
    React.createElement(
      Test,
      { title: 'Disabled by mixin' },
      React.createElement(
        I18n,
        null,
        React.createElement(NotTranslated2, null)
      )
    ),
    React.createElement(
      ImplicitTest,
      { title: 'Implicit translations (default behavior)' },
      'Hello, World!'
    ),
    React.createElement(
      Test,
      { title: 'Function (stateless) component (external wrapper)' },
      React.createElement(
        I18n,
        null,
        React.createElement(
          Func,
          null,
          'Hello, World!'
        )
      )
    ),
    React.createElement(
      Test,
      { title: 'Function (stateless) component (I18n.wrap)' },
      React.createElement(
        WrappedFunc,
        null,
        'Hello, World!'
      )
    ),
    React.createElement(
      ImplicitTest,
      { title: 'Function (stateless) component (implicit wrapper)' },
      React.createElement(
        Func,
        null,
        'Hello, World!'
      )
    )
  );

  ReactDOM.render(content, document.getElementById('container'));
}, 1);