package cn.iocoder.yudao.module.ip.enums;

import cn.iocoder.yudao.framework.common.exception.ErrorCode;

/**
 * ip 模块错误码枚举
 *
 * 错误码区间：1-100-000-000 ~ 1-100-999-999
 */
public interface ErrorCodeConstants {

    // ========== 项目展示 1-100-001-000 ==========
    ErrorCode PROJECT_NOT_EXISTS = new ErrorCode(1_100_001_000, "项目展示不存在");

    // ========== 旅行日记 1-100-002-000 ==========
    ErrorCode TRAVEL_DIARY_NOT_EXISTS = new ErrorCode(1_100_002_000, "旅行日记不存在");

    // ========== 随想碎片 1-100-003-000 ==========
    ErrorCode THOUGHT_NOT_EXISTS = new ErrorCode(1_100_003_000, "随想碎片不存在");

    // ========== 文章 1-100-004-000 ==========
    ErrorCode ARTICLE_NOT_EXISTS = new ErrorCode(1_100_004_000, "文章不存在");

    // ========== 团队成员 1-100-005-000 ==========
    ErrorCode TEAM_MEMBER_NOT_EXISTS = new ErrorCode(1_100_005_000, "团队成员不存在");
}
