import { Props, Key, Ref, ReactElementType } from 'shared/ReactType';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
    type: any;
    tag: WorkTag;
    pendingProps: Props;
    key: any;
    stateNode: any;
    ref: Ref;

    return: FiberNode | null; // 父fiberNode
    sibling: FiberNode | null; // 兄弟fiberNode
    child: FiberNode | null; // 子fiberNode
    index: number; // 当前fiber的 顺序

    memoizedProps: Props | null; // fiberNode 比较完成后的 props
    memoizedState: any;

    alternate: any;

    flags: Flags; // 标记
    subtreeFlags: Flags


    updateQueue: unknown;

    constructor(tag: WorkTag, pendingProps: Props, key: Key) {
        // 实例
        this.tag = tag;
        this.key = key;
        this.stateNode = null;
        this.type = null;

        // 构成树状结构
        this.return = null; // 指向父fiberNode
        this.sibling = null;
        this.child = null;
        this.index = 0;
        this.ref = null;

        // 作为工作单元
        this.pendingProps = pendingProps;
        this.memoizedProps = null;

        this.alternate = null;

        this.updateQueue = null;

        // 副作用
        this.flags = NoFlags;
        this.subtreeFlags = NoFlags;
    }
}

export class FiberRootNode {
    container: Container;
    current: FiberNode;
    finishedWork: FiberNode | null;

    constructor(container: Container, hostRootFiber: FiberNode) {
        this.container = container;
        this.current = hostRootFiber;
        hostRootFiber.stateNode = this;
        this.finishedWork = null;
    }
}

// 初始化 hostFiberRoot 返回 渲染之后的 hostFiberRoot
export const createWorkInProgress = (
    current: FiberNode,
    pendingProps: Props
): FiberNode => {
    let wip = current.alternate;

    if (wip === null) {
        // mount
        wip = new FiberNode(current.tag, pendingProps, current.key);
        wip.stateNode = current.stateNode;
        wip.alternate = current;
        current.alternate = wip;
    } else {
        // update
        wip.pendingProps = pendingProps;
        wip.flags = NoFlags;
        wip.subtreeFlags = NoFlags;
    }

    wip.type = current.type;
    wip.updateQueue = current.updateQueue;
    wip.child = current.child;
    wip.memoizedProps = current.memoizedProps;
    wip.memoizedState = current.memoizedState;

    return wip;
};

export function createFiberFromElement(element: ReactElementType): FiberNode {
    const { type, key, props } = element

    let fiberTag: WorkTag = FunctionComponent

    if (typeof type === "string") {
        fiberTag = HostComponent
    } else if (typeof type !== "function" && __DEV__) {
        console.warn("未定义的type类型")
    }

    const fiber = new FiberNode(fiberTag, props, key)
    fiber.type = type

    return fiber
}