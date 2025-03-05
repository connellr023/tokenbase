// import "katex/dist/katex.min.css";
// import katex from "katex";
import { ubuntu, ubuntuMono } from "@/utils/fonts";
import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type TypesetRendererProps = {
  children?: string;
};

const parseClassName = (className: string) => {
  const split = className.split("-");

  if (split.length === 1) {
    return "plaintext";
  }

  return split[1];
};

const TypesetRenderer: React.FC<TypesetRendererProps> = ({ children }) => {
  const renderers: Components = {
    code({ className, children, ...props }) {
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
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
      {children}
    </ReactMarkdown>
  );
};

export default TypesetRenderer;
