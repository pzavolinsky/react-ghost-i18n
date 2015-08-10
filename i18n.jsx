/// Copyright (c) 2015 Patricio Zavolinsky
(function() {
  // Wrap every component with an <I18n> unless the component opts-out with
  // React.createClass({ noI18n: true, ... }).
  var cc = React.createClass;
  React.createClass = function(c) {
    if (c.noI18n) return cc(c);
    // TODO: support noI18n in mixins
    c.renderWithoutI18n = c.render;
    c.render = function() {
      return <I18n {...this.props}>{this.renderWithoutI18n()}</I18n>
    }
    return cc(c);
  }
})();


var I18n = React.createClass({
  noI18n: true,
  warn: function(s) {
    s = 'I18n: '+s;
    if (this.props.warn === undefined) return console.warn(s);
    if (this.props.warn) this.props.warn(s);
  },
  translateString: function(s) {
    var locale = (this.props.locale || I18n.locale);
    var key = (this.props.prefix || '') + s;
    var translation = (typeof locale === 'function') ? locale(key): locale[key];
    if (translation) return translation;
    this.warn('missing translation for: '+key);
    return s;
  },
  translateProps: function(comp, index) {
    var newProps = { key: index };
    var tx = function(name) {
      if (comp.props[name]) {
        newProps[name] = this.translateString(comp.props[name]);
      }
    }.bind(this);

    tx('title');
    tx('alt');
    tx('placeholder');
    if (comp.type == 'input'
      && (comp.props.type == 'button' || comp.props.type == 'submit'))
      tx('value');
    return newProps;
  },
  translateChildren: function(comp) {
    if (!comp.props || !comp.props.children) return null;
    if (comp.type == I18n && comp != this
       || comp.props['i18n-disabled'] !== undefined) return comp.props.children;

    // === Map : [elements] -> string ======================================= //
    var texts = [];
    var oldChildren = [];
    React.Children.forEach(comp.props.children, function(c,i) {
      if (c.props) {
        texts.push('{'+oldChildren.length+'}');
        oldChildren.push(c);
      } else {
        texts.push(c);
      }
    });

    // === Translate ======================================================== //
    var text = texts.join('');
    var translation = (texts.length == oldChildren.length)
      ? text
      : this.translateString(text);

    // === Map : string -> [elements] ======================================= //
    var newChildren = [];
    function addChild(c) { if (c) newChildren.push(c); }

    var pos = 0;
    var re = new RegExp(/\{(\d+)\}/g);
    var r;
    while (r = re.exec(translation)) {
      addChild(translation.substring(pos, r.index));
      var index = parseInt(r[1]);
      var child = oldChildren[index];
      child = React.cloneElement(
        child,
        this.translateProps(child, index),
        this.translateChildren(child)
      );
      addChild(child);
      pos = re.lastIndex;
    }

    addChild(translation.substring(pos));

    if (newChildren.length != texts.length) {
      this.warn("incorrect number of arguments in translation for "+
        "'"+text+"' -> '"+translation+"'");
    }

    return (newChildren.length == 1) ? newChildren[0] : newChildren;
  },
  render: function() {
    return <span>{this.translateChildren(this)}</span>;
  }
});
