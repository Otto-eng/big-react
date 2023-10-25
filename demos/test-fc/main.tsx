import React from 'react';
import ReactDOM from 'react-dom/client';

const Child = () => {
	return <span>bigReact</span>;
};

function App() {
	return (
		<div>
			<Child />
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
