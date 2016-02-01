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
  render: function() {
    return <div className="test">
      <div className="title" i18n-disabled>{this.props.title}</div>
      <div className="body">{this.props.children}</div>
    </div>
  }
});

var NotTranslated1 = React.createClass({
  noI18n: true,
  render: function() { return <span>This is not translated</span> }
});

var DontTranslate = { I18n: false };
var NotTranslated2 = React.createClass({
  mixins: [DontTranslate],
  render: function() { return <span>This is not translated</span> }
});

var Func = ({children}) => <b>{children}</b>;
var WrappedFunc = I18n.wrap(({children}) => <b>{children}</b>);

// ========================================================================== //
// To opt back in the implicit (default) behavior just call:
I18n.optIn();

// Components defined from now on will have implicit translations by default:
var ImplicitTest = React.createClass({
  render: function() { return <Test {...this.props} />; }
});

// Note that you can still opt-out of translations on a per-component basis
// using the noI18n flag in React.createClass({ noI18n: true, ... }) a mixin
// like DontTranslate above.

// ========================================================================== //
setTimeout(function() {
  var content = <div>
    <Test title="Simple example">
      {/* see below for the implicit alternative */}
      <I18n>Hello, World!</I18n>
    </Test>
    <Test title="Translate children">
      <I18n>
        This text is <b>bold</b>!
      </I18n>
    </Test>
    <Test title="Translate properties">
      <I18n>
        <input placeholder="Write some text here" />
        <span title="Great!">Hover over me</span>
        <input type="button" value="I'm a button input" />
        <input type="submit" value="I'm a submit input" />
      </I18n>
    </Test>
    <Test title="Use a custom locale object">
      <I18n locale={{'Custom': 'Personalizado'}}>Custom</I18n>
    </Test>
    <Test title="Use a custom locale function">
      <I18n locale={function(s) { return 'a'; }}>It's always "a"</I18n>
    </Test>
    <Test title="Disable translations for some elements">
      <I18n>
        <div>Hello, World!</div>
        <div i18n-disabled>This is not translated</div>
      </I18n>
    </Test>
    <Test title="Use a custom warn function">
      <I18n warn={function(s) { console.log('custom log function: '+s); }}>
        Translation for this text will be missing (check browser console).
      </I18n>
    </Test>
    <Test title="Go crazy (mm/dd/yyyy to dd/mm/yyyy)">
      <I18n>
        <span>09</span>/<span>12</span>/<span>1900</span>
      </I18n>
    </Test>
    <Test title="Disabled by noI18n flag">
      <I18n>
        <NotTranslated1/>
      </I18n>
    </Test>
    <Test title="Disabled by mixin">
      <I18n>
        <NotTranslated2/>
      </I18n>
    </Test>
    <ImplicitTest title="Implicit translations (default behavior)">
      {/* note the missing <I18n> wrapper! */}
      Hello, World!
    </ImplicitTest>
    <Test title="Function (stateless) component (external wrapper)">
      <I18n><Func>Hello, World!</Func></I18n>
    </Test>
    <Test title="Function (stateless) component (I18n.wrap)">
      <WrappedFunc>Hello, World!</WrappedFunc>
    </Test>
    <ImplicitTest title="Function (stateless) component (implicit wrapper)">
      <Func>Hello, World!</Func>
    </ImplicitTest>
  </div>;

  ReactDOM.render(content, document.getElementById('container'));
}, 1);
