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

var Test = React.createClass({
  render: function() {
    return <div className="test">
      <div className="title">{this.props.title}</div>
      <div className="body">{this.props.children}</div>
    </div>
  }
});

setTimeout(function() {
  var content = <div>
    <Test title="Simple example">
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
        <span i18n-disabled>09</span>/
        <span i18n-disabled>12</span>/
        <span i18n-disabled>1900</span>
      </I18n>
    </Test>
  </div>;

  React.render(content, document.getElementById('container'));
}, 1);
