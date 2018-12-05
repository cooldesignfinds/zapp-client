import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, OrderedMap } from 'immutable';

import objectToOrderedMap from '../../lib/objectToOrderedMap';
import orderedMapToObject from '../../lib/orderedMapToObject';

import styles from './Engines.sass';

class Engines extends Component {
  constructor(props) {
    super(props);
    this.iframes = {};
  }
  componentDidMount() {
    this.updateFrames();
  }
  componentDidUpdate() {
    this.updateFrames();
  }
  updateFrames() {
    Object.keys(this.iframes).forEach((frameName) => {
      const iframe = this.iframes[frameName];
      if (!iframe || !iframe.contentWindow) {
        delete this.iframes[frameName];
        return;
      }
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      if (iframe.dataset.scripts) {
        iframe.dataset.scripts.split(',').forEach((dep) => {
          iframeDoc.write(`<script src="${dep}"></script>`);
        });
      }
      iframeDoc.write(`
        <script>
          function getType(val) {
            if (val === undefined) {
              return 'Undefined';
            } else if (val === null) {
              return 'Null';
            } else if (val && val.getType && typeof val.getType === 'function' && val.getType() === 'code') {
              return 'CodeItem';
            }
            return val.constructor.name || 'Object';
          }

          function isArray(val) {
            return getType(val) === 'Array';
          }

          function isBoolean(val) {
            return getType(val) === 'Boolean';
          }

          function isCode(val) {
            return getType(val) === 'CodeItem';
          }

          function isFalse(val) {
            return val === false;
          }

          function isNull(val) {
            return getType(val) === 'Null';
          }

          function isNumber(val) {
            return getType(val) === 'Number';
          }

          function isObject(val) {
            return getType(val) === 'Object';
          }

          function isString(val) {
            return getType(val) === 'String';
          }

          function isTrue(val) {
            return val === true;
          }

          function isUndefined(val) {
            return getType(val) === 'Undefined';
          }
        </script>
      `);
      iframeDoc.write(`<script>window.exports = window;</script>`);
      iframeDoc.write(`<script>${iframe.dataset.script}</script>`);
      iframeDoc.close();
    });
  }
  render() {
    const engines = [];
    const importsData = orderedMapToObject(this.props.importsData);
    importsData.push({
      engines: orderedMapToObject(this.props.engines)
    });
    const importsDatamap = objectToOrderedMap(importsData);
    [...importsDatamap.valueSeq()].forEach((importData) => {
      const importEngines = importData.get('engines');
      if (!importEngines) {
        return;
      }
      [...importEngines.keys()].forEach((importEngineName) => {
        const importEngine = importEngines.get(importEngineName);
        const script = Babel.transform(
          importEngine.get('engine'),
          { presets: ['es2015', 'react', 'stage-2'] }
        ).code;
        if (!engines.find(engine => engine.name === importEngineName)) {
          engines.push({
            name: importEngineName,
            script,
            scripts: importEngine.has('scripts') ? orderedMapToObject(importEngine.get('scripts')) : ''
          });
        }
      });
    });

    return (
      <div>
        {engines.map(({ name, script, scripts }) => {
          return (
            <iframe
              className={styles.frame}
              frameBorder={0}
              key={name}
              ref={(iframe) => { this.iframes[name] = iframe; }}
              name={name}
              src="about:blank"
              title={name}
              data-script={script}
              data-scripts={scripts}
            />
          );
        })}
      </div>
    );
  }
}

Engines.defaultProps = {
  engines: OrderedMap(),
  importsData: List()
};

Engines.propTypes = {
  engines: PropTypes.instanceOf(OrderedMap),
  importsData: PropTypes.instanceOf(List)
};

function mapStateToProps(state) {
  return {
    engines: state.project.engines,
    importsData: state.project.importsData
  };
}

export default connect(mapStateToProps)(Engines);
