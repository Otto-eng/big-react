export type Flags = number;

export const NoFlags = 0b0000000; // 无 fiber
export const Placement = 0b0000001; // 节点 插入 或者 移动
export const Update = 0b0000010; // 更新
export const ChildDeletion = 0b0000100; //

export const MutationMask = Placement | Update | ChildDeletion;
