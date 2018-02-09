export interface BizAppConfig {
    [key: string]: any;

    /**
     * 后端网址，建议配合 `environment` 一起使用
     */
    SERVER_URL: string;
}    