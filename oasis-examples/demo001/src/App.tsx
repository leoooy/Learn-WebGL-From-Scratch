import React from "react";
import { createOasis } from "./oasis";

function App() {
	React.useEffect(() => {
		createOasis();
	}, []);

	return (
    // 画布
		<canvas id="canvas" style={{ width: "100vw", height: "100vh" }}></canvas>
	);
}

export default App;
