import * as React from 'react';
import * as styles from './App.module.scss';
import Swipe from '../Swipe/Swipe';

interface Props {

}

interface State {

}

class App extends React.Component<Props, State> {
  render() {
    return (
      <div className={styles.app}>
        <Swipe itemWidth={300}>
          <div>
            1
          </div>
          <div>
            2
          </div>
          <div>
            3
          </div>
          <div>
            4
          </div>
          <div>
            5
          </div>
          <div>
            6
          </div>
          <div>
            7
          </div>
          <div>
            8
          </div>
        </Swipe>
      </div>
    );
  }
}

export default App;