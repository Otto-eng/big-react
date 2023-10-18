


import { FiberNode, FiberRootNode } from "./fiber";
import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { Container, appendChildToContainer } from "./hostConfig";
import { HostComponent, HostRoot, HostText } from "./workTags";

let nextEffects: FiberNode | null = null

export const commitMutationEffects = (finishedWork: FiberNode) => {

    nextEffects = finishedWork

    while (nextEffects !== null) {
        // 向下遍历
        const child: FiberNode | null = nextEffects.child

        if ((nextEffects.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
            // 向下便利 不存在 mutation 
            nextEffects = child
        } else {
            // 向上便利 DFS
            up: while (nextEffects !== null) {
                // 不存在 mutation 开始
                commitMutationEffectsOnFiber(nextEffects)
                const sibling: FiberNode | null = nextEffects.sibling
                if (sibling !== null) {
                    nextEffects = sibling

                    break up
                }

                nextEffects = nextEffects.return
            }

        }
    }

}

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {

    const flags = finishedWork.flags

    // flags Placement
    if ((flags & Placement) !== NoFlags) {
        commitPlacement(finishedWork)
        finishedWork.flags &= ~Placement
    }

    // flags Update
    // flags ChildDeletion
}

const commitPlacement = (finishedWork: FiberNode) => {
    if (__DEV__) {
        console.warn("执行placement操作--commitPlacement")
    }

    // parent DOM
    const hostParent = getHostParent(finishedWork)

    // finishedWork DOM append parent DOM
    appendPlacementIntoContainer(finishedWork, hostParent)
}


function getHostParent(fiber: FiberNode) {

    let parent = fiber.return

    while (parent) {
        const parentTag = parent.tag

        // HostComponent HostRoot
        if (parentTag === HostComponent) {
            return parent.stateNode as Container
        }

        if (parentTag === HostRoot) {
            return (fiber.stateNode as FiberRootNode).container
        }

        parent = parent.return
    }

    if (__DEV__) {
        console.warn("未找到 host parent --- getHostParent")
    }

}

export const appendPlacementIntoContainer = (
    finishedWork: FiberNode,
    hostParent: Container
) => {
    if (finishedWork.tag == HostComponent || finishedWork.tag === HostText) {
        appendChildToContainer(finishedWork.stateNode, hostParent)
        return
    }

    const child = finishedWork.child
    if (child !== null) {
        appendPlacementIntoContainer(child, hostParent);
        let sibling = child.sibling

        while (sibling !== null) {
            appendPlacementIntoContainer(sibling, hostParent);
            sibling = sibling.sibling
        }

    }
}

