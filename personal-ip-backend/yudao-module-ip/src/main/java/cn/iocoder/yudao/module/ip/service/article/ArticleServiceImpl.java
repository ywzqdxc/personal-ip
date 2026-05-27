package cn.iocoder.yudao.module.ip.service.article;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.article.vo.ArticlePageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.article.vo.ArticleSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.article.ArticleDO;
import cn.iocoder.yudao.module.ip.dal.mysql.article.ArticleMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.ip.enums.ErrorCodeConstants.ARTICLE_NOT_EXISTS;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Resource
    private ArticleMapper articleMapper;

    @Override
    public Long createArticle(ArticleSaveReqVO createReqVO) {
        ArticleDO article = BeanUtils.toBean(createReqVO, ArticleDO.class);
        article.setViewCount(0);
        articleMapper.insert(article);
        return article.getId();
    }

    @Override
    public void updateArticle(ArticleSaveReqVO updateReqVO) {
        validateExists(updateReqVO.getId());
        articleMapper.updateById(BeanUtils.toBean(updateReqVO, ArticleDO.class));
    }

    @Override
    public void deleteArticle(Long id) {
        validateExists(id);
        articleMapper.deleteById(id);
    }

    @Override
    public ArticleDO getArticle(Long id) {
        return articleMapper.selectById(id);
    }

    @Override
    public PageResult<ArticleDO> getArticlePage(ArticlePageReqVO pageReqVO) {
        return articleMapper.selectPage(pageReqVO);
    }

    @Override
    public List<ArticleDO> getPublishedArticleList(Integer pageNo, Integer pageSize) {
        return articleMapper.selectPage(
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageNo, pageSize),
                new LambdaQueryWrapperX<ArticleDO>()
                        .eq(ArticleDO::getStatus, 1)
                        .orderByDesc(ArticleDO::getPinned)
                        .orderByDesc(ArticleDO::getCreateTime))
                .getRecords();
    }

    @Override
    public ArticleDO getPublishedArticleBySlug(String slug) {
        return articleMapper.selectOne(new LambdaQueryWrapperX<ArticleDO>()
                .eq(ArticleDO::getSlug, slug)
                .eq(ArticleDO::getStatus, 1));
    }

    private void validateExists(Long id) {
        if (articleMapper.selectById(id) == null) {
            throw exception(ARTICLE_NOT_EXISTS);
        }
    }
}
