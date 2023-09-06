export declare interface IMenuData {
    /**
     * 权限名称
     */
    auth_name: string;
    /**
      * 子级
      */
    children?: IMenuData[];
    /**
      * 菜单图标
      */
    icon?: string;
    /**
      * id
      */
    id: number;
    /**
      * 对应url
      */
    path: string;
    /**
      * 路径类型，1菜单，2接口, 3按钮
      */
    path_type: number;
    /**
      * 父级id
      */
    pid: number;
    /**
      * 排序权重
      */
    sort?: number;
    edit?: number
}

