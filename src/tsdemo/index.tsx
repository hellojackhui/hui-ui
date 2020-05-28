import * as React from 'react';

export interface HellpProps {
  compiler: String,
  framework: String
}

export const Hello = (props: HellpProps) => <h1>hello from {props.compiler} and {props.framework}</h1>