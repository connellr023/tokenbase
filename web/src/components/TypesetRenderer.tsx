import "katex/dist/katex.min.css";
import { ubuntu500, ubuntuMono400 } from "@/utils/fonts";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

type TypesetRendererProps = {
  children?: string;
};

const extractLanguageName = (className: string) => {
  const split = className.split("-");

  if (split.length === 1) {
    return "plaintext";
  }

  return split[1];
};

const TypesetRenderer: React.FC<TypesetRendererProps> = ({ children }) => {
  const renderers: Components = {
    code({ className, children, ...props }) {
      const lang = extractLanguageName(className || "");

      return (
        <>
          <span className={ubuntu500.className}>{lang}</span>
          <div>
            <code
              className={`${className} ${ubuntuMono400.className}`}
              {...props}
            >
              {children}
            </code>
          </div>
        </>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={renderers}
    >
      {children}
    </ReactMarkdown>
  );
};

export default TypesetRenderer;
