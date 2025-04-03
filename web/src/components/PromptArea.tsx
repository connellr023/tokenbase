import styles from "@/styles/components/PromptArea.module.scss";
import { useState, useRef, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { merriweather500 } from "@/utils/fonts";
import {
  faArrowUp,
  faPaperclip,
  faStop,
} from "@fortawesome/free-solid-svg-icons";

type PromptAreaProps = {
  isDisabled: boolean;
  canCancel: boolean;
  canAttach: boolean;
  onSend: (prompt: string, promptImage: string[]) => void;
  onCancel: () => void;
};

const PromptArea: React.FC<PromptAreaProps> = ({
  isDisabled,
  canCancel,
  canAttach,
  onSend,
  onCancel,
}) => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([""]);
  const [prevImages, setPrevImages] = useState([""]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  let imgItems;

  const handleSend = () => {
    onSend(prompt.trim(), prevImages.slice(1));
    setPrompt("");
    setImages([""]);
    setPrevImages([""]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim().length > 0 && !isDisabled) {
        handleSend();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const toggleUploadModal = () => {
    const fileElem =  document.getElementById("myFile");
    fileElem?.click();
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    function addImage(f: Blob){
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrevImages([...prevImages, reader.result+""]);
      }
      reader.readAsDataURL(f);
    }
    let files = e.target.files;
    if (files) {
      setPrevImages([""]);
      Array.prototype.forEach.call(files, addImage);
      
    }    
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  useEffect(() => {
    window.addEventListener("resize", adjustTextareaHeight);

    return () => {
      window.removeEventListener("resize", adjustTextareaHeight);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.images}
      style={prevImages.length > 1? {display: "inline"}: {display: "none"}}
      >
        {prevImages.slice(1).map((img) => <img src={img+""} className={styles.imgPreview}></img>)}
      </div>
      <div>
        <textarea
          className={merriweather500.className}
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          rows={1}
          spellCheck={false}
        />
        <div className={styles.buttonContainer}>
            <input type="file" 
              multiple
              className={styles.fileUpload} 
              id="myFile" 
              name="filename"
              onChange={
                handleImageUpload
              }
            ></input>
            <button 
              type="button" 
              disabled={isDisabled || !canAttach || prevImages.length > 3}
              onClick={toggleUploadModal}
            >
              <FontAwesomeIcon icon={faPaperclip} />
            </button>
          {canCancel ? (
            <button onClick={onCancel}>
              <FontAwesomeIcon icon={faStop} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={isDisabled || prompt.trim().length === 0 && prevImages.length === 1}
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptArea;
