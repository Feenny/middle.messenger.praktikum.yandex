import { StoreEvents } from './Store';
import isEqual from '../utils/isEqual';

export function connect(mapStateToProps: (arg0: any) => any) {
    return function (Component: any) {
        return class extends Component {
            private onChangeStoreCallback: () => void;

            constructor(props: any) {
                // eslint-disable-next-line prefer-destructuring
                const store = window.store;

                // сохраняем начальное состояние
                let state = mapStateToProps(store.getState());

                super({ ...props, ...state });

                this.onChangeStoreCallback = () => {
                    // при обновлении получаем новое состояние
                    const newState = mapStateToProps(store.getState());

                    // если что-то из используемых данных поменялось, обновляем компонент
                    if (!isEqual(state, newState)) {
                        this.setProps({ ...newState });
                    }
                    state = newState;
                };

                // подписываемся на событие
                console.log('[HOC.ts] подписываемся');
                store.on(StoreEvents.Updated, this.onChangeStoreCallback);
            }

            componentWillUnmount() {
                console.log('[HOC.ts] componentWillUnmount');
                super.componentWillUnmount();
                window.store.off(
                    StoreEvents.Updated,
                    this.onChangeStoreCallback,
                );
            }
        };
    };
}
