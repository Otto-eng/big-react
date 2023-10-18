export type Flags = number;

export const NoFlags = 0b0000001; // 无 fiber
export const Placement = 0b0000010; // 节点 插入 或者 移动
export const Update = 0b0000100; // 更新
export const ChildDeletion = 0b0001000; //

export const MutationMask = Placement | Update | ChildDeletion
