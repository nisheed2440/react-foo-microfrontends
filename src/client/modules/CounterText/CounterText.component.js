import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'exenv';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class CounterText extends React.Component {
  componentWillReact() {
    console.log('CounterText will re-render, since the counterValue has changed!');
  }
  render() {
    const { store } = this.props;
    return <p className="title is-size-1">{store.counterValue}</p>;
  }
}

CounterText.propTypes = {
  store: PropTypes.any.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll('[data-component="CounterText"]')].forEach(el => {
    extendObservable(window.Store, window.FOOData[el.getAttribute('data-component')]);
    ReactDOM.hydrate(<CounterText store={window.Store} />, el);
  });
}

export default CounterText;
