package cn.iocoder.yudao.module.ip.dal.mysql.article;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.mybatis.core.mapper.BaseMapperX;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.article.vo.ArticlePageReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.article.ArticleDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ArticleMapper extends BaseMapperX<ArticleDO> {

    default PageResult<ArticleDO> selectPage(ArticlePageReqVO reqVO) {
        return selectPage(reqVO, new LambdaQueryWrapperX<ArticleDO>()
                .likeIfPresent(ArticleDO::getTitle, reqVO.getTitle())
                .eqIfPresent(ArticleDO::getCategory, reqVO.getCategory())
                .eqIfPresent(ArticleDO::getStatus, reqVO.getStatus())
                .orderByDesc(ArticleDO::getPinned)
                .orderByDesc(ArticleDO::getCreateTime));
    }
}
