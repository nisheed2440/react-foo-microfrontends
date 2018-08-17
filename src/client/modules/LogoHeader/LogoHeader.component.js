import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'exenv';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import logo from './reactfoo-logo.png';

@observer
class LogoHeader extends React.Component {
  @computed
  get addText() {
    // correct; computed property will track the `user.name` property
    return this.props.store.addText;
  }
  componentWillReact() {
    console.log('LogoHeader will re-render, since the counterValue has changed!');
  }
  render() {
    const { store } = this.props;
    const wrapperClass = classNames('hero', 'is-light', {
      'is-danger': store.counterValue < 0,
      'is-primary': store.counterValue > 10
    });
    return (
      <section className={wrapperClass}>
        <div className="hero-body">
          <div className="container has-text-centered">
            <img src={logo} alt="Logo" style={{ height: 150 }} />
          </div>
        </div>
      </section>
    );
  }
}

LogoHeader.propTypes = {
  store: PropTypes.any.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll('[data-component="LogoHeader"]')].forEach(el => {
    ReactDOM.hydrate(<LogoHeader store={window.Store} />, el);
  });
}

export default LogoHeader;
