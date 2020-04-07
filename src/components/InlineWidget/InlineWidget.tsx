import * as React from "react";
import { loadScript } from "../../calendly";
import { CALENDLY_SCRIPT_SOURCE } from "../../constants";

export interface Props {
  url: string;
  prefill?: {
    name?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
  };
  styles?: React.CSSProperties | undefined;
}

const defaultStyles = {
  minWidth: "320px",
  height: "630px",
};

export class InlineWidget extends React.Component<Props> {
  private readonly widgetParentContainerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.widgetParentContainerRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    if (!document.querySelector(`script[src="${CALENDLY_SCRIPT_SOURCE}"]`)) {
      loadScript();
    } else {
      window.Calendly.initInlineWidget({
        url: this.props.url,
        parentElement: this.widgetParentContainerRef.current!,
        prefill: this.props.prefill,
      })
    }
  }

  createURL() {
    const { prefill } = this.props;
    if(!prefill){
      return this.props.url; 
    }
    return `${this.props.url}?${prefill.name != null ? `name=${prefill.name}&` : ""}${prefill.firstname != null ? `first_name=${prefill.firstname}&` : ""}${prefill.lastname != null ? `last_name=${prefill.lastname}&` : ""}${prefill.email != null ? `email=${prefill.email}` : ""}`
  }

  render() {
    return (
      <div
        className="calendly-inline-widget"
        style={this.props.styles || defaultStyles}
        data-url={this.createURL()}
        ref={this.widgetParentContainerRef}
      ></div>
    );
  }
}
