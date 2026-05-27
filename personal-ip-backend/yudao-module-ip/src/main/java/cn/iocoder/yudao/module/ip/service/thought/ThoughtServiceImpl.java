package cn.iocoder.yudao.module.ip.service.thought;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import cn.iocoder.yudao.module.ip.controller.admin.thought.vo.ThoughtPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.thought.vo.ThoughtSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.thought.ThoughtDO;
import cn.iocoder.yudao.module.ip.dal.mysql.thought.ThoughtMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

import static cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil.exception;
import static cn.iocoder.yudao.module.ip.enums.ErrorCodeConstants.THOUGHT_NOT_EXISTS;

/**
 * 随想碎片 Service 实现
 */
@Service
@Validated
public class ThoughtServiceImpl implements ThoughtService {

    @Resource
    private ThoughtMapper thoughtMapper;

    @Override
    public Long createThought(ThoughtSaveReqVO createReqVO) {
        ThoughtDO thought = BeanUtils.toBean(createReqVO, ThoughtDO.class);
        thoughtMapper.insert(thought);
        return thought.getId();
    }

    @Override
    public void updateThought(ThoughtSaveReqVO updateReqVO) {
        validateThoughtExists(updateReqVO.getId());
        ThoughtDO updateObj = BeanUtils.toBean(updateReqVO, ThoughtDO.class);
        thoughtMapper.updateById(updateObj);
    }

    @Override
    public void deleteThought(Long id) {
        validateThoughtExists(id);
        thoughtMapper.deleteById(id);
    }

    @Override
    public ThoughtDO getThought(Long id) {
        return thoughtMapper.selectById(id);
    }

    @Override
    public PageResult<ThoughtDO> getThoughtPage(ThoughtPageReqVO pageReqVO) {
        return thoughtMapper.selectPage(pageReqVO);
    }

    @Override
    public List<ThoughtDO> getPublishedThoughtList(Integer pageNo, Integer pageSize) {
        return thoughtMapper.selectPage(
                new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageNo, pageSize),
                new LambdaQueryWrapperX<ThoughtDO>()
                        .eq(ThoughtDO::getStatus, 1)
                        .orderByDesc(ThoughtDO::getCreateTime))
                .getRecords();
    }

    private void validateThoughtExists(Long id) {
        if (thoughtMapper.selectById(id) == null) {
            throw exception(THOUGHT_NOT_EXISTS);
        }
    }
}
