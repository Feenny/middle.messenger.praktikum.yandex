import Block from "../../tools/Block";
import { ErrorContainer } from "../../components/error-container";
import ErrorPageTemplate from "./error4-page.hbs?raw";
import { Link } from "../../components/link";

class Error4Template extends Block {
  render() {
    return ErrorPageTemplate;
  }
}

class Error4PageContent extends Block {
  render() {
    return ErrorContainer;
  }
}

class LinkComponent extends Block {
  render() {
    return Link;
  }
}

export class Error4Page extends Block {
  constructor(props: { [key: string]: string }) {
    super({
      ...props,
      errorTemplate: new Error4Template({
        ErrorContainer: new Error4PageContent({
          error: "404",
          desctiption: "беда",
          Link: new LinkComponent({
            text: "Назад к чатам",
            page: "chat",
          }),
        }),
      }),
    });
  }
  override render() {
    return `{{{ errorTemplate }}}`;
  }
}
