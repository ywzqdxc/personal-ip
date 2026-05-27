package cn.iocoder.yudao.module.ip.service.team;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.ip.controller.admin.team.vo.TeamMemberPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.team.vo.TeamMemberSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.team.TeamMemberDO;
import jakarta.validation.Valid;
import java.util.List;

public interface TeamMemberService {
    Long create(@Valid TeamMemberSaveReqVO vo);
    void update(@Valid TeamMemberSaveReqVO vo);
    void delete(Long id);
    TeamMemberDO get(Long id);
    PageResult<TeamMemberDO> page(TeamMemberPageReqVO vo);
    List<TeamMemberDO> getPublishedList();
}
