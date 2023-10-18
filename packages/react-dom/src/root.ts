// ReactDOM.createRoot().render(<App/>)
import { ReactElementType } from 'shared/ReactType';
import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';
import { Container } from 'hostConfig';

export function createRoot(container: Container) {
	const root = createContainer(container);

	return {
		render(element: ReactElementType) {
			updateContainer(element, root);
		}
	};
}
