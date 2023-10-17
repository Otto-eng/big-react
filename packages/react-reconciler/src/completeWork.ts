

// 递归中的归阶段

import { FiberNode } from "./fiber";
import { NoFlags } from "./fiberFlags";
import { appendInitialChild, createInstance, createTextInstance } from "./hostConfig";
import { HostRoot, HostComponent, HostText } from "./workTags";

export const completeWork = (wip: FiberNode) => {
    // 构建离屏DOM树


    const newProps = wip.pendingProps
    const current = wip.alternate

    switch (wip.tag) {
        case HostRoot:
            bubbleProperties(wip)
            return null;
        case HostComponent:

            if (current !== null && wip.stateNode) {
                // update
            } else {
                // 首屏渲染

                // 构建 DOM
                const instance = createInstance(wip.type, newProps)

                // 将 DOM 插入到树中
                appendAllChildren(instance, wip)

                wip.stateNode = instance
            }

            bubbleProperties(wip)

            return null;
        case HostText:
            if (current !== null && wip.stateNode) {
                // update
            } else {
                // 首屏渲染

                // 构建 DOM
                const instance = createTextInstance(newProps.content)

                // 将 DOM 插入到树中

                wip.stateNode = instance
            }

            bubbleProperties(wip)

            return null;
        default:
            if (__DEV__) {
                console.warn("未处理的类型 wip.tag -- completeWork")
            }
            break;
    }
}

// 将 wip 插入到 parent
function appendAllChildren(parent: FiberNode, wip: FiberNode) {
    let node = wip.child

    while (node !== null) {

        // 
        // const A = <span>1</span>
        // const B = <div><A /></div> ==> <siv><span>1</span></div>
        if (node.tag === HostComponent || node.tag === HostText) {
            // 直接插入
            appendInitialChild(parent, node?.stateNode)
        } else if (node.child !== null) {
            node.child.return = node
            node = node.child
            continue
        }

        if (node === wip) {
            return;
        }

        while (node.sibling === null) {
            if (node.return === null || node.return === wip) {
                return
            }
            node = node.return
        }

        // 子 fiber 的兄弟 也插入
        node.sibling.return = node.return

        node = node.sibling
    }

}

function bubbleProperties(wip: FiberNode) {
    let subtreeFlags = NoFlags
    let child = wip.child
    while (child !== null) {
        subtreeFlags |= child.subtreeFlags
        subtreeFlags |= child.flags

        child.return = wip
        child = child.sibling
    }

    wip.subtreeFlags |= subtreeFlags
}