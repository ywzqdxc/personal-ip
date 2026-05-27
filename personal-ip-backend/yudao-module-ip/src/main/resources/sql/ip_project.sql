-- 在 ruoyi-vue-pro 数据库中执行
CREATE TABLE IF NOT EXISTS `ip_project` (
  `id`           bigint       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name`         varchar(100) NOT NULL                COMMENT '项目名称',
  `slug`         varchar(100) NOT NULL                COMMENT 'URL 标识，唯一',
  `description`  varchar(500)     DEFAULT NULL        COMMENT '简短描述',
  `cover_url`    varchar(500)     DEFAULT NULL        COMMENT '封面图 URL',
  `preview_url`  varchar(500)     DEFAULT NULL        COMMENT '悬浮预览图 URL',
  `github_url`   varchar(300)     DEFAULT NULL        COMMENT 'GitHub 链接',
  `demo_url`     varchar(300)     DEFAULT NULL        COMMENT '演示链接',
  `tech_stack`   varchar(300)     DEFAULT NULL        COMMENT '技术栈，逗号分隔',
  `content`      longtext         DEFAULT NULL        COMMENT 'Markdown 详情',
  `sort_order`   int          NOT NULL DEFAULT 0      COMMENT '排序权重',
  `featured`     tinyint(1)   NOT NULL DEFAULT 0      COMMENT '是否首页置顶 0否 1是',
  `status`       tinyint      NOT NULL DEFAULT 0      COMMENT '状态 0草稿 1发布',
  `creator`      varchar(64)      DEFAULT ''          COMMENT '创建者',
  `create_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`      varchar(64)      DEFAULT ''          COMMENT '更新者',
  `update_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`      tinyint(1)   NOT NULL DEFAULT 0      COMMENT '是否删除',
  `tenant_id`    bigint       NOT NULL DEFAULT 0      COMMENT '租户编号',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目展示';
