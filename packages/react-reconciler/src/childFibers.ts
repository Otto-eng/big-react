import { ReactElementType } from 'shared/ReactType';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

function ChildReconceler(shouldTrackEffects: boolean) {
	function reconcileSingleElement(
		returnFiber: FiberNode,
		_currentFiber: FiberNode | null,
		element: ReactElementType
	): FiberNode {
		// 根据 element 创建 fiber
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;

		return fiber;
	}

	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		_currentFiber: FiberNode | null,
		content: string | number
	): FiberNode {
		// 根据 element 创建 fiber
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;

		return fiber;
	}

	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}

		return fiber;
	}

	return function reconcileChildenFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 判断当前fiber的类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(
							returnFiber,
							currentFiber,
							newChild
						)
					);

				default:
					if (__DEV__) {
						console.warn(
							'未实现的reconcile类型-------newChild',
							newChild
						);
					}
					break;
			}
		}

		//TODO:多节点情况 ul>li*3

		// HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

		console.warn('未实现的reconcile类型-------newChild-----func', newChild);

		return null;
	};
}

export const reconcelerChildFibers = ChildReconceler(true);
export const mountChildFibers = ChildReconceler(false);
