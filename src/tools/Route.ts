import Block from './Block';

interface IProps {
    rootQuery: string;
}

export class Route {
    private _pathname: string;

    private _blockClass: typeof Block;

    private _block: Block | null = null;

    protected _props: { rootQuery: string };

    constructor(pathname: string, view: typeof Block, props: IProps) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            console.log(`${pathname} pathname`);
            this._pathname = pathname;
            this.render();
        }
    }

    leave() {
        if (this._block) {
            this._block.hide();
        }
    }

    match(pathname: string) {
        return pathname === this._pathname;
    }

    _renderDom(query: string, block: Block) {
        const root = document.querySelector(query);
        root?.append(block.getContent());
    }

    render() {
        if (!this._block) {
            this._block = new this._blockClass(this._props);
            this._renderDom(this._props.rootQuery, this._block);
            // this.render();
            return;
        }

        this._block.show();
    }
}
