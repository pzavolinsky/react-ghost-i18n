/// Copyright (c) 2015 Patricio Zavolinsky
const I18n = (function() {
  const I18n = React.createClass({
    noI18n: true,
    prop: function(name) {
      return (this.props.i18n && this.props.i18n[name])
        || this.props[name]
        || I18n[name];
    },
    warn: function(s) {
      s = 'I18n: '+s;
      const warn = this.prop('warn');
      if (warn) warn(s);
    },
    translateString: function(s) {
      const locale = this.prop('locale');
      const key = (this.prop('prefix') || '') + s;
      const translation = (typeof locale === 'function')
        ? locale(key)
        : locale && locale[key];
      if (translation) return translation;
      if (s && s.match(/[a-z]/i)) this.warn('missing translation for: '+key);
      return s;
    },
    translateProps: function(comp, index) {
      const newProps = { key: index };
      const tx = (name) => {
        if (comp.props[name]) {
          newProps[name] = this.translateString(comp.props[name]);
        }
      };
      if (typeof comp.type == 'string') {
        tx('title');
        tx('alt');
        tx('placeholder');
        if (comp.type == 'input'
          && (comp.props.type == 'button' || comp.props.type == 'submit'))
          tx('value');
      }

      const i18nProps = (comp.type == I18n) ? comp : newProps.i18n = {};
      const copyProp = (name) => {
        i18nProps[name] = comp.props[name] || this.prop(name);
      };
      copyProp('warn');
      copyProp('locale');
      copyProp('prefix');
      return newProps;
    },
    translateChildren: function(comp) {
      if (!comp.props || !comp.props.children) return null;
      if (comp.type == I18n && comp != this
         || comp.props['i18n-disabled'] !== undefined) return comp.props.children;

      // === Map : [elements] -> string ======================================= //
      const texts = [];
      const oldChildren = [];
      React.Children.forEach(comp.props.children, function(c,i) {
        if (c.props) {
          texts.push('{'+oldChildren.length+'}');
          oldChildren.push(c);
        } else {
          texts.push(c);
        }
      });

      // === Translate ======================================================== //
      const text = texts.join('');
      const translation = (texts.length == oldChildren.length)
        ? text
        : this.translateString(text);

      // === Map : string -> [elements] ======================================= //
      const newChildren = [];
      function addChild(c) { if (c) newChildren.push(c); }

      var pos = 0;
      const re = new RegExp(/\{(\d+)\}/g);
      var r;
      var matches = 0;
      while (r = re.exec(translation)) {
        ++matches;
        addChild(translation.substring(pos, r.index));
        const index = parseInt(r[1]);
        const child = oldChildren[index];
        const newChild = React.cloneElement(
          child,
          this.translateProps(child, index),
          this.translateChildren(child)
        );
        addChild(newChild);
        pos = re.lastIndex;
      }

      addChild(translation.substring(pos));

      if (matches != oldChildren.length) {
        this.warn("incorrect number of arguments in translation for "+
          "'"+text+"' -> '"+translation+"'");
      }

      return (newChildren.length == 1) ? newChildren[0] : newChildren;
    },
    render: function() {
      return <span>{this.translateChildren(this)}</span>;
    }
  });

  I18n.warn = function(s) { console.warn(s); }

  // Wrap every component with an <I18n> unless the component opts-out with
  // React.createClass({ noI18n: true, ... }).
  var filter = Array.prototype.filter || function(fn) {
    var r = [];
    for (var i in this) {
      var e = this[i];
      if (fn(e)) r.push(e);
    }
    return r;
  };
  function disabledByMixin(c) {
    if (!c.mixins) return;
    return filter.call(c.mixins, function(m) { return m.noI18n; });
  }

  I18n.wrap = render => props => <I18n {...props}>{render(props)}</I18n>;

  I18n.optIn = function() {
    if (I18n.originalCreateClass) return;
    I18n.originalCreateClass = React.createClass;
    React.createClass = function(c) {
      if (c.noI18n || disabledByMixin(c)) return I18n.originalCreateClass(c);
      c.renderWithoutI18n = c.render;
      c.render = function() {
        return <I18n {...this.props}>{this.renderWithoutI18n()}</I18n>
      }
      return I18n.originalCreateClass(c);
    }
  }
  I18n.optOut = function() {
    React.createClass = I18n.originalCreateClass || React.createClass;
    delete I18n.originalCreateClass;
  }

  I18n.optIn();

  return I18n;
})();
