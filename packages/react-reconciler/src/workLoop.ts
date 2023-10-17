import { beginWOrk } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

// 执行初始化
function prepareFreshStack(root: FiberRootNode) {
    workInProgress = createWorkInProgress(root.current, {});
}

// fiber中 调度 update
export function scheduleUpdateOnFiber(fiber: FiberNode) {
    // TODO:调度功能
    const root = markUpdateFromFiberToRoot(fiber);

    renderRoot(root);
}

// 找寻 fiberRootNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
    let node = fiber;

    let parent = node.return;

    while (parent !== null) {
        node = parent;
        parent = node.return;
    }

    if (node.tag === HostRoot) {
        return node.stateNode;
    }

    return null;
}

//
function renderRoot(root: FiberRootNode) {
    // 初始化

    prepareFreshStack(root);

    do {
        try {
            workLoop();
            break;
        } catch (error) {
            if (__DEV__) {
                console.warn('workLoop 错误');
            }
            workInProgress = null;
        }
    } while (true);

    const finishedWork = root.current.alternate

    root.finishedWork = finishedWork

    // wip fiberNode树 树中的flags  执行DOM操作
    // commitRoot(root)
}



function workLoop() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}

// fiber向下找寻 子 fiberNode 更换 props 状态 若未找到子fiberNode 则开始归
function performUnitOfWork(fiber: FiberNode) {
    const next = beginWOrk(fiber);
    fiber.memoizedProps = fiber.pendingProps;
    if (next === null) {
        completeUnitOfWork(fiber);
    } else {
        workInProgress = next;
    }
}

// fiber中若有兄弟 则替换为 兄弟fiberNode 没有则回指父fiberNode
function completeUnitOfWork(fiber: FiberNode) {
    let node: FiberNode = fiber;
    do {
        completeWork(node);
        const sibling = node.sibling;
        if (sibling !== null) {
            workInProgress = sibling;
            return;
        }
        node = node.return;
        workInProgress = node;
    } while (fiber !== null);
}
