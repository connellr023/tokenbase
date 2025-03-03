// import "katex/dist/katex.min.css";
// import katex from "katex";
import { ubuntu, ubuntuMono } from "@/utils/fonts";
import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type TypesetRendererProps = {
  content: string;
};

const parseClassName = (className: string) => {
  const split = className.split("-");

  if (split.length === 1) {
    return "Plain Text";
  }

  return split[1];
};

const TypesetRenderer: React.FC<TypesetRendererProps> = ({ content }) => {
  const renderers: Components = {
    code({ node, inline, className, children, ...props }: any) {
      const lang = parseClassName(className || "");

      return (
        <>
          <span className={ubuntu.className}>{lang}</span>
          <div>
            <code className={`${className} ${ubuntuMono.className}`} {...props}>
              {children}
            </code>
          </div>
        </>
      );
    },
  };

  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkGfm]}
      components={renderers}
    />
  );
};

export default TypesetRenderer;
