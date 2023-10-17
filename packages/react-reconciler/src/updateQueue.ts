import { Action } from "shared/ReactType";



export interface Update<State> {
    action: Action<State>
}

export interface UpdateQueue<State> {
    shared: {
        pending: Update<State> | null
    }
}

// 创建 update
export const createUpdate = <State>(action: Action<State>): Update<State> => {
    return {
        action
    }
}

// 创建 updateQueue
export const createUpdateQueue = <State>() => {
    return {
        shared: {
            pending: null
        }
    } as UpdateQueue<State>
}


// 将 update 更新到 updateQueue
export const enqueueUpdate = <State>(
    updateQueue: UpdateQueue<State>,
    update: Update<State>
) => {
    updateQueue.shared.pending = update
}


// 更改 状态
export const processUpdateQueue = <State>(
    baseState: State, // 初始状态
    pendingUpdate: Update<State> | null
): { memoizedState: State } => {

    const result: ReturnType<typeof processUpdateQueue<State>> = {
        memoizedState: baseState
    }

    if (pendingUpdate) {

        const action = pendingUpdate.action
        // setState(prev=> prev+1)
        if (action instanceof Function) {
            result.memoizedState = action(baseState)
        } else[
            // setState(2)
            result.memoizedState = action
        ]

    }

    return result
}