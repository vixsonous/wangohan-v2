
import useToolbarStates from "../toolbar-states";
import React from "react";
import useImageYoutubeHelper from "./image-youtube-helper";
import { LexicalEditor } from "lexical";

const ImageYoutube = ({
  states,
  editor,
}: {
  states: ReturnType<typeof useToolbarStates>;
  editor: LexicalEditor;
}) => {
  const imgYtHelper = useImageYoutubeHelper(states);

  const handleYoutubeInsert =
    (editor: LexicalEditor) => (e: React.MouseEvent<HTMLButtonElement>) =>
      imgYtHelper.displayYoutubeInsert(editor);

  return (
    <h1>Image Youtube</h1>
    // <Dropdown
    //   openIcon={
    //     <ButtonIcon>
    //       <Plus />
    //       <ButtonText>Insert</ButtonText>
    //       <CaretDown size={REGICONSIZE} />
    //     </ButtonIcon>
    //   }
    //   closeIcon={
    //     <ButtonIcon>
    //       <Plus />
    //       <ButtonText>Insert</ButtonText>
    //       <CaretDown size={REGICONSIZE} />
    //     </ButtonIcon>
    //   }
    // >
    //   <ul className=" flex flex-col gap-2 bg-secondary-bg items-center rounded-md border border-primary-text">
    //     <li
    //       className={`flex items-center justify-between w-full px-2 ${
    //         states.icons.justifyIdx === 0 ? "bg-primary-bg" : ""
    //       } rounded-t-md`}
    //     >
    //       <Button
    //         onClick={imgYtHelper.displayImageSelection}
    //         className="toolbar-item spaced flex gap-4"
    //         aria-label="Image Insert"
    //       >
    //         <Image size={REGICONSIZE} />
    //         <ButtonText>Image</ButtonText>
    //       </Button>
    //     </li>
    //     <li className={`flex items-center justify-between w-full px-2`}>
    //       <Button
    //         onClick={handleYoutubeInsert(editor)}
    //         className="toolbar-item spaced flex gap-4"
    //         aria-label="Youtube Video"
    //       >
    //         <YoutubeLogo size={REGICONSIZE} />
    //         <ButtonText>Youtube Video</ButtonText>
    //       </Button>
    //     </li>
    //   </ul>
    // </Dropdown>
  );
};

export default ImageYoutube;
