import { Button, SIZE } from "baseui/button"
import { Input } from "baseui/input"
import { useStyletron } from "styletron-react"
import { useEditor } from "@layerhub-io/react"
import { IStaticText } from "@layerhub-io/types"
import { nanoid } from "nanoid"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { renderLatexToDataURL } from "~/utils/latex"
import { useState } from "react"

export default function () {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const [latexInput, setLatexInput] = useState("E = mc^2")

  const addMathEquation = async (latex: string) => {
    if (editor) {
      try {
        const svgDataURL = renderLatexToDataURL(latex)
        const options = {
          id: nanoid(),
          type: "StaticImage",
          src: svgDataURL,
          metadata: {
            type: "math",
            latex: latex,
          },
        }
        editor.objects.add(options)
      } catch (error) {
        console.error("Error rendering LaTeX:", error)
        // Show user-friendly error message
        alert(`Error rendering LaTeX equation: ${latex}. Please check your syntax.`)
      }
    }
  }

  const commonEquations = [
    { name: "Pythagorean Theorem", latex: "a^2 + b^2 = c^2" },
    { name: "Quadratic Formula", latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" },
    { name: "Einstein's Mass-Energy", latex: "E = mc^2" },
    { name: "Euler's Identity", latex: "e^{i\\pi} + 1 = 0" },
    { name: "Derivative", latex: "\\frac{d}{dx}f(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}" },
    { name: "Integral", latex: "\\int_a^b f(x) dx" },
    { name: "Summation", latex: "\\sum_{i=1}^{n} x_i" },
    { name: "Limit", latex: "\\lim_{x \\to \\infty} \\frac{1}{x} = 0" },
  ]

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Math</Block>
        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      
      <Scrollable>
        <Block padding={"0 1.5rem"}>
          <Block $style={{ marginBottom: "1rem" }}>
            <Block $style={{ marginBottom: "0.5rem", fontSize: "14px", fontWeight: 500 }}>
              Custom Equation
            </Block>
            <Input
              value={latexInput}
              onChange={(e) => setLatexInput(e.currentTarget.value)}
              placeholder="Enter LaTeX equation..."
              overrides={{
                Root: {
                  style: {
                    marginBottom: "0.5rem",
                  },
                },
              }}
            />
            <Button
              onClick={() => addMathEquation(latexInput)}
              size={SIZE.compact}
              overrides={{
                Root: {
                  style: {
                    width: "100%",
                  },
                },
              }}
            >
              Add Custom Equation
            </Button>
          </Block>

          <Block $style={{ marginBottom: "1rem" }}>
            <Block $style={{ marginBottom: "0.5rem", fontSize: "14px", fontWeight: 500 }}>
              Common Equations
            </Block>
            <Block
              $style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "8px",
              }}
            >
              {commonEquations.map((eq, index) => (
                <MathEquationItem key={index} equation={eq} onClick={() => addMathEquation(eq.latex)} />
              ))}
            </Block>
          </Block>
        </Block>
      </Scrollable>
    </Block>
  )
}

interface MathEquation {
  name: string
  latex: string
}

function MathEquationItem({ equation, onClick }: { equation: MathEquation; onClick: () => void }) {
  const [css] = useStyletron()
  return (
    <div
      onClick={onClick}
      className={css({
        position: "relative",
        background: "#f8f8fb",
        cursor: "pointer",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e1e5e9",
        transition: "all 0.2s ease",
        ":hover": {
          background: "#e8f4fd",
          borderColor: "#1e88e5",
        },
      })}
    >
      <div
        className={css({
          fontSize: "12px",
          fontWeight: 500,
          color: "#333",
          marginBottom: "4px",
        })}
      >
        {equation.name}
      </div>
      <div
        className={css({
          fontSize: "14px",
          fontFamily: "monospace",
          color: "#666",
        })}
      >
        {equation.latex}
      </div>
    </div>
  )
}
