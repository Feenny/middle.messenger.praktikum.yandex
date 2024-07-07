import Block from "../../tools/Block"
import { ErrorContainer } from "../../components/error-container"
import { Link } from "../../components/link"

class Error5PageContent extends Block {
  render() {
    return ErrorContainer
  }
}
class LinkComponent extends Block {
  render() {
    return Link
  }
}

export class Error5Page extends Block {
  constructor(props: { [key: string]: string }) {
    super({
      ...props,
      errorPageContent: new Error5PageContent({
        error: "500",
        desctiption: "Мы уже фиксим :)",
        Link: new LinkComponent({
          text: "Назад к чатам",
          page: "chat"
        })
      })
    })
  }

  override render() {
    return "{{{ errorPageContent }}}"
  }
}
