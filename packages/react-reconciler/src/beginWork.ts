// 递归中的递阶段

import { ReactElementType } from 'shared/ReactType';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcelerChildFibers } from './childFibers';

export const beginWOrk = (wip: FiberNode) => {
    // 比较 返回子fiberNode

    switch (wip.tag) {
        case HostRoot:

            return updateHostRoot(wip);
        case HostComponent:

            return updateHostComponent(wip);
        case HostText:

            return null;
        default:
            if (__DEV__) {
                console.warn("未实现的类型")
            }
            break;
    }

    return null
};

// hostRootFiber
function updateHostRoot(wip: FiberNode) {
    const baseState = wip.memoizedState
    const updateQueue = wip.updateQueue as UpdateQueue<Element>
    const pending = updateQueue.shared.pending
    updateQueue.shared.pending = null

    const { memoizedState } = processUpdateQueue(baseState, pending)

    wip.memoizedState = memoizedState

    const nextChildren = wip.memoizedState


    reconcileChilden(wip, nextChildren)
    return wip
}

// 更新组件
function updateHostComponent(wip: FiberNode) {
    const nextProps = wip.memoizedProps
    const nextChildren = nextProps.children

    reconcileChilden(wip, nextChildren)

    return wip.child
}


function reconcileChilden(wip: FiberNode, children?: ReactElementType) {

    const current = wip.alternate

    if (current !== null) {
        // update
        wip.child = reconcelerChildFibers(wip, current.child, children)

    } else {
        // mount
        wip.child = mountChildFibers(wip, null, children)

    }


}