package cn.iocoder.yudao.module.ip.service.thought;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.ip.controller.admin.thought.vo.ThoughtPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.thought.vo.ThoughtSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.thought.ThoughtDO;
import jakarta.validation.Valid;

import java.util.List;

/**
 * 随想碎片 Service 接口
 */
public interface ThoughtService {

    Long createThought(@Valid ThoughtSaveReqVO createReqVO);

    void updateThought(@Valid ThoughtSaveReqVO updateReqVO);

    void deleteThought(Long id);

    ThoughtDO getThought(Long id);

    PageResult<ThoughtDO> getThoughtPage(ThoughtPageReqVO pageReqVO);

    /** 获得已发布的随想列表（分页） */
    List<ThoughtDO> getPublishedThoughtList(Integer pageNo, Integer pageSize);
}
