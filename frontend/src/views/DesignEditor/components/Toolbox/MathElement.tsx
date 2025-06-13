import React from "react"
import { useActiveObject, useEditor } from "@layerhub-io/react"
// import getSelectionType from "~/utils/get-selection-type"
import { Input } from "baseui/input"
import { Block } from "baseui/block"
import { ChevronDown } from "baseui/icon"
import Common from "./Common"
import TextColor from "~/components/Icons/TextColor"
import TextAlignCenter from "~/components/Icons/TextAlignCenter"

import { Button, SIZE, KIND } from "baseui/button"
import { StatefulTooltip, PLACEMENT } from "baseui/tooltip"
import LetterCase from "~/components/Icons/LetterCase"
import Spacing from "~/components/Icons/Spacing"
import { StatefulPopover } from "baseui/popover"
import TextAlignJustify from "~/components/Icons/TextAlignJustify"
import TextAlignLeft from "~/components/Icons/TextAlignLeft"
import TextAlignRight from "~/components/Icons/TextAlignRight"
import { Slider } from "baseui/slider"
import useAppContext from "~/hooks/useAppContext"
import getSelectionType from "~/utils/get-selection-type"
import { getTextProperties } from "../../utils/text"
import Scrollbar from "@layerhub-io/react-custom-scrollbar"
interface TextState {
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
  family: string
  styleOptions: StyleOptions
}

interface StyleOptions {
  hasItalic: boolean
  hasBold: boolean
  options: any[]
}

const initialOptions: TextState = {
  family: "CoreLang",
  bold: false,
  italic: false,
  underline: false,
  color: "#00000",
  styleOptions: {
    hasBold: true,
    hasItalic: true,
    options: [],
  },
}
export default function () {
  const [state, setState] = React.useState<TextState>(initialOptions)
  const activeObject = useActiveObject() as Required<IStaticText>
  const { setActiveSubMenu } = useAppContext()
  const editor = useEditor()

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject && activeObject.type === "StaticText") {
        const textProperties = getTextProperties(activeObject, SAMPLE_FONTS)
        setState({ ...state, ...textProperties })
      }
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
      }
    }
  }, [editor, activeObject])

  return (
    <Block
      $style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 12px", justifyContent: "space-between" }}
    >
      <Block display={"flex"} gridGap="0.5rem" alignItems={"center"}>

        <Block display={"flex"} alignItems={"center"}>
          <StatefulTooltip
            placement={PLACEMENT.bottom}
            showArrow={true}
            accessibilityType={"tooltip"}
            content="Text color"
          >
            <Button onClick={() => setActiveSubMenu("TextFill")} size={SIZE.mini} kind={KIND.tertiary}>
              <TextColor color={state.color} size={22} />
            </Button>
          </StatefulTooltip>

          <Block width={"1px"} height={"24px"} backgroundColor="rgb(213,213,213)" margin={"0 4px"} />

          <TextAlign />

          <Block width={"1px"} height={"24px"} backgroundColor="rgb(213,213,213)" margin={"0 4px"} />

          <TextSpacing />
          <Block width={"1px"} height={"24px"} backgroundColor="rgb(213,213,213)" margin={"0 4px"} />
          <Button size={SIZE.compact} kind={KIND.tertiary}>
            Animate
          </Button>
        </Block>
      </Block>
      <Common />
    </Block>
  )
}

function TextSpacing() {
  const editor = useEditor()
  const activeObject = useActiveObject()
  const [state, setState] = React.useState<{
    charSpacing: number
    lineHeight: number
  }>({ charSpacing: 0, lineHeight: 0 })

  React.useEffect(() => {
    if (activeObject) {
      // @ts-ignore
      const { charSpacing, lineHeight } = activeObject
      setState({ ...state, charSpacing: charSpacing / 10, lineHeight: lineHeight * 10 })
    }
  }, [activeObject])

  const handleChange = (type: string, value: number[]) => {
    if (editor) {
      if (type === "charSpacing") {
        setState({ ...state, [type]: value[0] })

        // @ts-ignore
        editor.objects.update({
          [type]: value[0] * 10,
        })
      } else {
        setState({ ...state, [type]: value[0] })
        // @ts-ignore

        editor.objects.update({
          [type]: value[0] / 10,
        })
      }
    }
  }
  return (
    <StatefulPopover
      showArrow={true}
      placement={PLACEMENT.bottom}
      content={() => (
        <Block padding={"12px"} width={"200px"} backgroundColor={"#ffffff"} display={"grid"} gridGap={"8px"}>
          <Block>
            <Block $style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Block $style={{ fontSize: "14px" }}>Line height</Block>
              <Block width={"52px"}>
                <Input
                  overrides={{
                    Input: {
                      style: {
                        backgroundColor: "#ffffff",
                        textAlign: "center",
                      },
                    },
                    Root: {
                      style: {
                        borderBottomColor: "rgba(0,0,0,0.15)",
                        borderTopColor: "rgba(0,0,0,0.15)",
                        borderRightColor: "rgba(0,0,0,0.15)",
                        borderLeftColor: "rgba(0,0,0,0.15)",
                        borderTopWidth: "1px",
                        borderBottomWidth: "1px",
                        borderRightWidth: "1px",
                        borderLeftWidth: "1px",
                        height: "26px",
                      },
                    },
                    InputContainer: {},
                  }}
                  size={SIZE.mini}
                  onChange={() => {}}
                  value={Math.round(state.lineHeight)}
                />
              </Block>
            </Block>

            <Block>
              <Slider
                overrides={{
                  InnerThumb: () => null,
                  ThumbValue: () => null,
                  TickBar: () => null,
                  Track: {
                    style: {
                      paddingRight: 0,
                      paddingLeft: 0,
                    },
                  },
                  Thumb: {
                    style: {
                      height: "12px",
                      width: "12px",
                    },
                  },
                }}
                min={0}
                max={100}
                // step
                marks={false}
                value={[state.lineHeight]}
                onChange={({ value }) => handleChange("lineHeight", value)}
              />
            </Block>
          </Block>
          <Block>
            <Block $style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Block $style={{ fontSize: "14px" }}>Char spacing</Block>
              <Block width={"52px"}>
                <Input
                  overrides={{
                    Input: {
                      style: {
                        backgroundColor: "#ffffff",
                        textAlign: "center",
                      },
                    },
                    Root: {
                      style: {
                        borderBottomColor: "rgba(0,0,0,0.15)",
                        borderTopColor: "rgba(0,0,0,0.15)",
                        borderRightColor: "rgba(0,0,0,0.15)",
                        borderLeftColor: "rgba(0,0,0,0.15)",
                        borderTopWidth: "1px",
                        borderBottomWidth: "1px",
                        borderRightWidth: "1px",
                        borderLeftWidth: "1px",
                        height: "26px",
                      },
                    },
                    InputContainer: {},
                  }}
                  size={SIZE.mini}
                  onChange={() => {}}
                  value={Math.round(state.charSpacing)}
                />
              </Block>
            </Block>

            <Block>
              <Slider
                overrides={{
                  InnerThumb: () => null,
                  ThumbValue: () => null,
                  TickBar: () => null,
                  Track: {
                    style: {
                      paddingRight: 0,
                      paddingLeft: 0,
                    },
                  },
                  Thumb: {
                    style: {
                      height: "12px",
                      width: "12px",
                    },
                  },
                }}
                min={-20}
                max={100}
                marks={false}
                value={[state.charSpacing]}
                onChange={({ value }) => handleChange("charSpacing", value)}
              />
            </Block>
          </Block>
        </Block>
      )}
    >
      <Block>
        <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Spacing">
          <Button size={SIZE.mini} kind={KIND.tertiary}>
            <Spacing size={24} />
          </Button>
        </StatefulTooltip>
      </Block>
    </StatefulPopover>
  )
}

const TEXT_ALIGNS = ["left", "center", "right", "justify"]

function TextAlign() {
  const editor = useEditor()
  const activeObject = useActiveObject()
  const [state, setState] = React.useState<{ align: string }>({ align: "left" })

  React.useEffect(() => {
    if (activeObject) {
      // @ts-ignore
      setState({ align: activeObject.textAlign })
    }
  }, [activeObject])
  return (
    <StatefulPopover
      showArrow={true}
      placement={PLACEMENT.bottom}
      content={() => (
        <Block
          padding={"12px"}
          backgroundColor={"#ffffff"}
          display={"grid"}
          gridTemplateColumns={"1fr 1fr 1fr 1fr"}
          gridGap={"8px"}
        >
          <Button
            isSelected={state.align === TEXT_ALIGNS[0]}
            onClick={() => {
              // @ts-ignore
              editor.objects.update({ textAlign: TEXT_ALIGNS[0] })
              setState({ align: TEXT_ALIGNS[0] })
            }}
            kind={KIND.tertiary}
            size={SIZE.mini}
          >
            <TextAlignLeft size={24} />
          </Button>
          <Button
            isSelected={state.align === TEXT_ALIGNS[1]}
            onClick={() => {
              // @ts-ignore
              editor.objects.update({ textAlign: TEXT_ALIGNS[1] })
              setState({ align: TEXT_ALIGNS[1] })
            }}
            kind={KIND.tertiary}
            size={SIZE.mini}
          >
            <TextAlignCenter size={24} />
          </Button>
          <Button
            isSelected={state.align === TEXT_ALIGNS[2]}
            onClick={() => {
              // @ts-ignore
              editor.objects.update({ textAlign: TEXT_ALIGNS[2] })
              setState({ align: TEXT_ALIGNS[2] })
            }}
            kind={KIND.tertiary}
            size={SIZE.mini}
          >
            <TextAlignRight size={24} />
          </Button>
          <Button
            isSelected={state.align === TEXT_ALIGNS[3]}
            onClick={() => {
              // @ts-ignore
              editor.objects.update({ textAlign: TEXT_ALIGNS[3] })
              setState({ align: TEXT_ALIGNS[3] })
            }}
            kind={KIND.tertiary}
            size={SIZE.mini}
          >
            <TextAlignJustify size={24} />
          </Button>
        </Block>
      )}
      returnFocus
      autoFocus
    >
      <Block>
        <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType={"tooltip"} content="Align">
          <Button size={SIZE.mini} kind={KIND.tertiary}>
            <TextAlignCenter size={24} />
          </Button>
        </StatefulTooltip>
      </Block>
    </StatefulPopover>
  )
}
