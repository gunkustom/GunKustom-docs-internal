import React, { useEffect, useState } from "react";

interface DrawioProps {
  diagram: string;
}

const Drawio: React.FC<DrawioProps> = ({ diagram }) => {
  const [diagramContent, setDiagramContent] = useState<string>("");

  useEffect(() => {
    // Fetch the content of the .drawio file
    fetch(diagram)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((text) => {
        // For now, we're just setting the raw XML or text content
        setDiagramContent(text);
      })
      .catch((error) => console.error("Error loading diagram:", error));
  }, [diagram]);

  return (
    <div>
      {diagramContent ? (
        <pre>{diagramContent}</pre> // Temporarily render content as text
      ) : (
        <p>Loading diagram...</p>
      )}
    </div>
  );
};

export default Drawio;
