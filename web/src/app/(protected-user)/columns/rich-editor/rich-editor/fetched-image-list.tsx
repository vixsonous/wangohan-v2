
import useEditorStates from "./editor-states";
import useEditorHelper from "./editor-helper";
import { LexicalEditor } from "lexical";
import { INSERT_IMAGE_COMMAND } from "./plugins/ImagePlugin";
import useToolbarStates from "./plugins/toolbar-states";
import Button from "@/components/Button";
import Image from "@/components/Image/client";

const FetchedImageList = ({
  states,
  helper,
  editor,
}: {
  states: ReturnType<typeof useEditorStates | typeof useToolbarStates>;
  helper: ReturnType<typeof useEditorHelper>;
  editor?: LexicalEditor | undefined;
}) => {

  const handleInsertImageFromList = (
    src: string,
    filename: string,
    states: ReturnType<typeof useEditorStates | typeof useToolbarStates>,
    editor?: LexicalEditor | undefined
  ) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      if ("form" in states)
        helper.insertImageFromList(e, src, filename, states);

      if (!editor) return;
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText: filename,
        src: src,
        width: 500,
      });

    };
  };

  return (
    <div className="relative top-0 left-0 justify-center items-center flex w-full h-full">
      <div className="bg-primary-bg p-4 max-w-screen-lg w-full flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-lg">Uploaded Images</span>
          <Button className="group relative p-2">
            <div className="absolute w-full h-full bg-black top-0 left-0 opacity-0 group-hover:opacity-20 transition-all rounded-full"></div>
          </Button>
        </div>
        <hr className="border-b-[1px] border-black w-full" />
        <div
          className={`${
            !states.imageFetch && "overflow-y-scroll"
          } max-h-96 min-w-96`}
        >
          {states.imageFetch ? (
            <h1>Loading</h1>
          ) : (
            <div>
              {states.imageList.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {states.imageList.map((i, idx) => {
                    return (
                      <Button
                        onClick={handleInsertImageFromList(
                          i.blog_image_url,
                          i.blog_image_title,
                          states,
                          editor
                        )}
                        name={i.blog_image_title}
                        id={i.blog_image_url}
                        key={idx}
                        className=""
                      >
                        <Image
                          className="w-full"
                          fit="cover"
                          width={250}
                          height={250}
                          src={i.blog_image_url}
                        />
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <span>Empty Files</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FetchedImageList;
