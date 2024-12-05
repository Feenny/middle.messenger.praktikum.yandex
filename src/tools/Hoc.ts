/* eslint-disable func-names */
import { StoreEvents } from './Store';
import isEqual from '../utils/isEqual';

export function connect(mapStateToProps: (arg0: any) => any) {
    return function (Component: any) {
        return class extends Component {
            private onChangeStoreCallback: () => void;

            constructor(props: any) {
                // eslint-disable-next-line prefer-destructuring
                const store = window.store;

                let state = mapStateToProps(store.getState());

                super({ ...props, ...state });

                this.onChangeStoreCallback = () => {
                    const newState = mapStateToProps(store.getState());

                    if (!isEqual(state, newState)) {
                        this.setProps({ ...newState });
                    }
                    state = newState;
                };

                store.on(StoreEvents.Updated, this.onChangeStoreCallback);
            }

            componentWillUnmount() {
                super.componentWillUnmount();
                window.store.off(
                    StoreEvents.Updated,
                    this.onChangeStoreCallback,
                );
            }
        };
    };
}
