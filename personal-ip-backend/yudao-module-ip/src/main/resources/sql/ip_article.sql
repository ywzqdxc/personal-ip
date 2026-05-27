-- 在 ruoyi-vue-pro 数据库中执行
CREATE TABLE IF NOT EXISTS `ip_article` (
  `id`          bigint       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title`       varchar(200) NOT NULL                COMMENT '标题',
  `slug`        varchar(200) NOT NULL                COMMENT 'URL slug',
  `cover_url`   varchar(500)     DEFAULT NULL        COMMENT '封面图',
  `summary`     varchar(500)     DEFAULT NULL        COMMENT '摘要',
  `content`     longtext         DEFAULT NULL        COMMENT 'Markdown 正文',
  `tags`        varchar(200)     DEFAULT NULL        COMMENT '标签，逗号分隔',
  `category`    varchar(50)      DEFAULT NULL        COMMENT '分类',
  `status`      tinyint      NOT NULL DEFAULT 0      COMMENT '0草稿 1发布',
  `pinned`      tinyint(1)   NOT NULL DEFAULT 0      COMMENT '是否置顶',
  `view_count`  int          NOT NULL DEFAULT 0      COMMENT '浏览数',
  `creator`     varchar(64)      DEFAULT ''          COMMENT '创建者',
  `create_time` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`     varchar(64)      DEFAULT ''          COMMENT '更新者',
  `update_time` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`     tinyint(1)   NOT NULL DEFAULT 0      COMMENT '是否删除',
  `tenant_id`   bigint       NOT NULL DEFAULT 0      COMMENT '租户编号',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章';
