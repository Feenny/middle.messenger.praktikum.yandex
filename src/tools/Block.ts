import Handlebars from "handlebars"
import EventBus from "./EventBus"

export interface IProps {
  __id?: string
  events?: {
    [key: string]: (event: Event) => void
  }
  attr?: Record<string, string>
  [key: string]: unknown
}

export default class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  }

  _element: HTMLElement = document.createElement("div")

  props: IProps

  children: Record<string, Block> = {}

  lists: Record<string, Block[]>

  eventBus: () => EventBus

  _id = Math.floor(100000 + Math.random() * 900000)

  constructor(propsWithChildren = {}) {
    const eventBus = new EventBus()
    const { props, children, lists } =
      this._getChildrenPropsAndProps(propsWithChildren)
    this.props = this._makePropsProxy({ ...props })
    this.children = children
    this.lists = lists
    this.eventBus = () => eventBus
    this._registerEvents(eventBus)
    eventBus.emit(Block.EVENTS.INIT)
  }

  _addEvents() {
    const { events = {} } = this.props
    Object.keys(events).forEach(eventName => {
      this._element.addEventListener(eventName, events[eventName])
    })
  }

  _removeEvents() {
    const { events = {} } = this.props
    Object.keys(events).forEach(eventName => {
      this._element?.removeEventListener(eventName, events[eventName])
    })
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this))
  }

  init() {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
  }

  _componentDidMount() {
    this.componentDidMount()
    Object.values(this.children).forEach(child => {
      child.dispatchComponentDidMount()
    })
  }

  componentDidMount(oldProps?: IProps) {}

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM)
  }

  _componentDidUpdate(oldProps: IProps, newProps: IProps) {
    const response = this.componentDidUpdate(oldProps, newProps)
    if (!response) {
      return
    }
    this._render()
  }

  componentDidUpdate(oldProps: IProps, newProps: IProps) {
    return true
  }

  _getChildrenPropsAndProps(propsAndChildren: IProps) {
    const props: Record<string, unknown> = {}
    const children: Record<string, Block> = {}
    const lists: Record<string, Block[]> = {}

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value
      } else if (Array.isArray(value)) {
        lists[key] = value
      } else {
        props[key] = value
      }
    })

    return { props, children, lists }
  }

  addAttributes() {
    const { attr = {} } = this.props

    Object.entries(attr).forEach(([key, value]) => {
      this._element!.setAttribute(key, value)
    })
  }

  setProps = (nextProps: IProps) => {
    if (!nextProps) {
      return
    }

    Object.assign(this.props, nextProps)
  }

  get element() {
    return this._element
  }

  _render() {
    console.log("Render")
    const propsAndStubs: IProps = { ...this.props }
    const _tmpId = Math.floor(100000 + Math.random() * 900000)
    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`
    })

    Object.entries(this.lists).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="__l_${_tmpId}"></div>`
    })

    const fragment = this._createDocumentElement(
      "template"
    ) as HTMLTemplateElement
    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs)

    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`)
      stub?.replaceWith(child.getContent())
    })

    Object.entries(this.lists).forEach(([key, child]) => {
      const listCont = this._createDocumentElement(
        "template"
      ) as HTMLTemplateElement
      child.forEach(item => {
        if (item instanceof Block) {
          listCont.content.append(item.getContent())
        } else {
          listCont.content.append(`${item}`)
        }
      })
      const stub = fragment.content.querySelector(`[data-id="__l_${_tmpId}"]`)
      stub?.replaceWith(listCont.content)
    })

    const newElement = fragment.content.firstElementChild as HTMLElement
    if (this._element) {
      this._element.replaceWith(newElement)
    }
    this._element = newElement
    this._addEvents()
    this.addAttributes()
  }

  render() {}

  getContent() {
    return this.element
  }

  _makePropsProxy(props: { [index: string | symbol]: unknown }) {
    const self = this

    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop]
        return typeof value === "function" ? value.bind(target) : value
      },
      set(target, prop, value) {
        const oldTarget = { ...target }
        target[prop] = value
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target)
        return true
      },
      deleteProperty() {
        throw new Error("No access")
      }
    })
  }

  _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName)
  }

  show() {
    this.getContent()!.style.display = "block"
  }

  hide() {
    this.getContent()!.style.display = "none"
  }
}
