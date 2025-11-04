import { useRef } from "react";
import Editor, { type EditorHandle } from "../src/components/editor";

function App() {
  const ref = useRef<EditorHandle>(null);

  return (
    <section
      style={{
        width: "100dvw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "80%" }}>
        <Editor ref={ref} />
      </div>
    </section>
  );
}

export default App;
