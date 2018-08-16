import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { extendObservable } from 'mobx';
import ExecutionEnvironment from 'exenv';

class CounterButtons extends React.PureComponent {
  increment = () => {
    const { store } = this.props;
    if (typeof store.counterValue === 'number') {
      store.counterValue += 1;
    }
  };
  decrement = () => {
    const { store } = this.props;
    if (typeof store.counterValue === 'number') {
      store.counterValue -= 1;
    }
  };
  render() {
    const { store } = this.props;
    return (
      <div className="field has-addons" style={{ marginTop: 10 }}>
        <p className="control">
          <button className="button" onClick={this.decrement}>
            <span>{store.subtractText}</span>
          </button>
        </p>
        <p className="control">
          <button className="button" onClick={this.increment}>
            <span>{store.addText}</span>
          </button>
        </p>
      </div>
    );
  }
}

CounterButtons.propTypes = {
  store: PropTypes.any.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll('[data-component="CounterButtons"]')].forEach(el => {
    extendObservable(window.Store, window.FOOData[el.getAttribute('data-component')]);
    ReactDOM.hydrate(<CounterButtons store={window.Store} />, el);
  });
}

export default CounterButtons;
