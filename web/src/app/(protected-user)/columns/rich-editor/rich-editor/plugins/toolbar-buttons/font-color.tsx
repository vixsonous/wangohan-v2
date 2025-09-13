"use client";
import React, {useEffect, useState} from "react";
import Image from "@/components/Image/client";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {FORMAT_FONTCOLOR_COMMAND} from "@/app/(protected-user)/columns/rich-editor/nodes/FontColorNode";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";

export const DEFAULT_COLOR_VALUES = "#000000,#ffffff,#0000FF,#008000,#FF2C2C";
export default function FontColor() {

  const [editor] = useLexicalComposerContext();

  const user = useSelector((state: RootState) => state.user);

  const [previousColors, setPreviousColors] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    const colors = localStorage.getItem(`user_${user?.user_id}_prev_colors`);
    if(user && !colors) {
      localStorage.setItem(`user_${user?.user_id}_prev_colors`, DEFAULT_COLOR_VALUES);
      setPreviousColors(DEFAULT_COLOR_VALUES);
      setColor(DEFAULT_COLOR_VALUES.split(",")[0]);
    } else if(colors !== null) {
      setPreviousColors(colors);
      setColor(colors.split(",")[0]);
    }
  }, []);

  const colorOnBlur = (e:React.ChangeEvent<HTMLInputElement>) => {

    if(user === null) return;
    const prevColors = localStorage.getItem(`user_${user.user_id}_prev_colors`);
    editor.dispatchCommand(FORMAT_FONTCOLOR_COMMAND, String(e.currentTarget.value));
    if(prevColors) {
      const newColors = prevColors.includes(e.currentTarget.value) ? prevColors : e.currentTarget.value + "," + prevColors;

      if(newColors.split(",").length < 6) {
        localStorage.setItem(`user_${user.user_id}_prev_colors`, newColors);
        setPreviousColors(newColors);
        setColor(newColors.split(",")[0]);
      } else {
        const newArr = newColors.split(",");
        newArr.pop();
        localStorage.setItem(`user_${user.user_id}_prev_colors`, newArr.join(","));
        setPreviousColors(newArr.join(","));
        setColor(newArr[0]);
      }
    }
  }
  return (
    <div className={"flex items-center gap-2"}>
      <label
        htmlFor="text-color"
        className="flex gap-1 items-center cursor-pointer"
      >
        <Image src={"/icons/svg/primary-aa.svg"} alt={"text color icon"} width={20} height={20}/>
        <input
          onBlur={colorOnBlur}
          type="color"
          id="text-color"
          value={color}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
            setColor(e.target.value);
          }}
          style={{background: color}}
          className="p-0 color-input cursor-pointer appearance-none w-7 rounded-full border border-primary-text"
        />
        <style jsx>{`
          .color-input::-webkit-color-swatch-wrapper {
            padding: 0;
            border-radius: 9999px;
          }
          .color-input::-webkit-color-swatch {
            border: none;
            border-radius: 9999px;
          }
          .color-input::-moz-color-swatch {
            border: none;
            border-radius: 9999px;
          }
        `}</style>
      </label>
      {previousColors !== null && (
        <div className={"flex gap-1 items-center"}>
          {previousColors.split(",").map((color) => (
            <button key={color} type={"button"} style={{background: color}} className={`border border-primary-text w-4 cursor-pointer h-4 aspect-square rounded-full`}>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}