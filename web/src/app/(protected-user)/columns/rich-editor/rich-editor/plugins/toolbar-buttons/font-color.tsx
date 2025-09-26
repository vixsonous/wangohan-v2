"use client";
import React, {useEffect, useState} from "react";
import Image from "@/components/Image/client";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {FORMAT_FONTCOLOR_COMMAND} from "@/app/(protected-user)/columns/rich-editor/nodes/FontColorNode";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {
  FORMAT_FONTBACKGROUNDCOLOR_COMMAND
} from "@/app/(protected-user)/columns/rich-editor/nodes/FontBackgroundColorNode";

export const DEFAULT_COLOR_VALUES = "#523636,#ffffff,#0000FF,#008000,#FF2C2C";
export const DEFAULT_BACKGROUND_COLOR_VALUES = "#FFFAF0,#ffffff,#0000FF,#008000,#FF2C2C"
export type FONT_COLOR_TYPE = "font-color";
export type BG_COLOR_TYPE = "bg-color";
export const FONT_COLOR = "font-color";
export const BG_COLOR = "bg-color";

type FontColorProps = {
  type: FONT_COLOR_TYPE | BG_COLOR_TYPE;
}
export default function FontColor({type = FONT_COLOR}: FontColorProps) {

  const [editor] = useLexicalComposerContext();

  const user = useSelector((state: RootState) => state.user);

  const [previousColors, setPreviousColors] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    const colors = localStorage.getItem(`user_${user?.user_id}_prev_colors:${type}`);
    if(user && !colors) {
      localStorage.setItem(`user_${user?.user_id}_prev_colors:${type}`, type === FONT_COLOR ? DEFAULT_COLOR_VALUES : DEFAULT_BACKGROUND_COLOR_VALUES);
      setPreviousColors(type === FONT_COLOR ? DEFAULT_COLOR_VALUES : DEFAULT_BACKGROUND_COLOR_VALUES);
      setColor((type === FONT_COLOR ? DEFAULT_COLOR_VALUES : DEFAULT_BACKGROUND_COLOR_VALUES).split(",")[0]);
    } else if(colors !== null) {
      setPreviousColors(colors);
      setColor(colors.split(",")[0]);
    }
  }, [type, user]);

  const colorOnBlur = (e:React.ChangeEvent<HTMLInputElement>) => {

    if(user === null) return;
    const prevColors = localStorage.getItem(`user_${user.user_id}_prev_colors:${type}`);
    editor.dispatchCommand(type === FONT_COLOR ? FORMAT_FONTCOLOR_COMMAND : FORMAT_FONTBACKGROUNDCOLOR_COMMAND, String(e.currentTarget.value));
    if(prevColors) {
      const newColors = prevColors.includes(e.currentTarget.value) ? prevColors : e.currentTarget.value + "," + prevColors;

      if(newColors.split(",").length < 6) {
        localStorage.setItem(`user_${user.user_id}_prev_colors:${type}`, newColors);
        setPreviousColors(newColors);
        setColor(newColors.split(",")[0]);
      } else {
        const newArr = newColors.split(",");
        newArr.pop();
        localStorage.setItem(`user_${user.user_id}_prev_colors:${type}`, newArr.join(","));
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
        <Image src={`/icons/svg/primary-${type === FONT_COLOR ? "aa" : "paint-bucket"}.svg`} alt={"text color icon"} width={20} height={20}/>
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
            <button key={color} onClick={() => {
              editor.dispatchCommand(type === FONT_COLOR ? FORMAT_FONTCOLOR_COMMAND : FORMAT_FONTBACKGROUNDCOLOR_COMMAND, String(color));
              setColor(color);
            }} type={"button"} style={{background: color}} className={`border border-primary-text w-4 cursor-pointer h-4 aspect-square rounded-full`}>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}