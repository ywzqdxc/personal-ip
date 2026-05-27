-- 在 ruoyi-vue-pro 数据库中执行
CREATE TABLE IF NOT EXISTS `ip_thought` (
  `id`          bigint       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `content`     varchar(1000) NOT NULL               COMMENT '正文（短文本）',
  `mood`        varchar(20)       DEFAULT NULL       COMMENT '心情标签',
  `tags`        varchar(200)      DEFAULT NULL       COMMENT '标签，逗号分隔',
  `image_url`   varchar(500)      DEFAULT NULL       COMMENT '可选配图',
  `status`      tinyint       NOT NULL DEFAULT 0     COMMENT '状态 0草稿 1发布',
  `creator`     varchar(64)       DEFAULT ''         COMMENT '创建者',
  `create_time` datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`     varchar(64)       DEFAULT ''         COMMENT '更新者',
  `update_time` datetime      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`     tinyint(1)    NOT NULL DEFAULT 0     COMMENT '是否删除',
  `tenant_id`   bigint        NOT NULL DEFAULT 0     COMMENT '租户编号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='随想碎片';
