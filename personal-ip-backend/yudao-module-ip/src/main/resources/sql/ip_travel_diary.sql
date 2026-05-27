-- 在 ruoyi-vue-pro 数据库中执行
CREATE TABLE IF NOT EXISTS `ip_travel_diary` (
  `id`           bigint       NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title`        varchar(200) NOT NULL                COMMENT '章节标题',
  `destination`  varchar(100)     DEFAULT NULL        COMMENT '目的地',
  `trip_date`    date             DEFAULT NULL        COMMENT '旅行日期',
  `cover_url`    varchar(500)     DEFAULT NULL        COMMENT '封面图 URL',
  `accent_color` varchar(20)      DEFAULT '#3B82F6'   COMMENT '章节主题色，如 #FF6B35',
  `content`      longtext         DEFAULT NULL        COMMENT 'Markdown 正文',
  `photos`       json             DEFAULT NULL        COMMENT '图片 URL 数组',
  `sort_order`   int          NOT NULL DEFAULT 0      COMMENT '章节排序',
  `status`       tinyint      NOT NULL DEFAULT 0      COMMENT '状态 0草稿 1发布',
  `creator`      varchar(64)      DEFAULT ''          COMMENT '创建者',
  `create_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater`      varchar(64)      DEFAULT ''          COMMENT '更新者',
  `update_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`      tinyint(1)   NOT NULL DEFAULT 0      COMMENT '是否删除',
  `tenant_id`    bigint       NOT NULL DEFAULT 0      COMMENT '租户编号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='旅行日记';
