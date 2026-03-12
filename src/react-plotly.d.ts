declare module 'react-plotly.js' {
  import { Component } from 'react';

  interface PlotProps {
    data: any[];
    layout?: any;
    config?: any;
    onInitialized?: (figure: any, graphDiv: any) => void;
    onUpdate?: (figure: any, graphDiv: any) => void;
    onError?: (err: any) => void;
    style?: React.CSSProperties;
    className?: string;
    divId?: string;
  }

  class Plot extends Component<PlotProps> {}

  export default Plot;
}
