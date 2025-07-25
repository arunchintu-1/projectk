import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((res) => setData(res.message));
  }, []);

  return <h1>{data || "Loading..."}</h1>;
}

export default App;
