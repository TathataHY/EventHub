import { Controller, Post, Body, Get, Param, UseGuards, Req, Query, Put, Delete, Patch } from '@nestjs/common';
import { 
  CreateGroupUseCase, 
  JoinGroupByInvitationCodeUseCase,
  GetUserGroupsUseCase,
  GetGroupByIdUseCase,
  GetGroupMembersUseCase,
  UpdateGroupUseCase,
  LeaveGroupUseCase,
  RemoveGroupMemberUseCase,
  CloseGroupUseCase,
  RegenerateInvitationCodeUseCase,
  ChangeGroupMemberRoleUseCase,
  InviteUserToGroupUseCase,
  RespondToGroupInvitationUseCase,
  GetPendingGroupInvitationsUseCase,
  InvitationResponse,
  CreateGroupDto,
  UpdateGroupDto,
  GroupDto,
  GroupMemberDto,
  GroupMemberRole
} from '@eventhub/application';
import { AuthGuard } from '../common/guards/auth.guard';
import { extractUserId } from '../utils/request-utils';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly joinGroupByInvitationCodeUseCase: JoinGroupByInvitationCodeUseCase,
    private readonly getUserGroupsUseCase: GetUserGroupsUseCase,
    private readonly getGroupByIdUseCase: GetGroupByIdUseCase,
    private readonly getGroupMembersUseCase: GetGroupMembersUseCase,
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    private readonly leaveGroupUseCase: LeaveGroupUseCase,
    private readonly removeGroupMemberUseCase: RemoveGroupMemberUseCase,
    private readonly closeGroupUseCase: CloseGroupUseCase,
    private readonly regenerateInvitationCodeUseCase: RegenerateInvitationCodeUseCase,
    private readonly changeGroupMemberRoleUseCase: ChangeGroupMemberRoleUseCase,
    private readonly inviteUserToGroupUseCase: InviteUserToGroupUseCase,
    private readonly respondToGroupInvitationUseCase: RespondToGroupInvitationUseCase,
    private readonly getPendingGroupInvitationsUseCase: GetPendingGroupInvitationsUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() request: any
  ): Promise<GroupDto> {
    const userId = extractUserId(request);
    return this.createGroupUseCase.execute(createGroupDto, userId);
  }

  @Post('join')
  @UseGuards(AuthGuard)
  async joinGroupByInvitationCode(
    @Body('invitationCode') invitationCode: string,
    @Req() request: any
  ): Promise<{ success: boolean; message: string }> {
    const userId = extractUserId(request);
    const result = await this.joinGroupByInvitationCodeUseCase.execute(invitationCode, userId);
    
    return {
      success: result.success,
      message: result.message
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUserGroups(
    @Req() request: any,
    @Query('eventId') eventId?: string,
    @Query('onlyActive') onlyActive?: boolean
  ): Promise<GroupDto[]> {
    const userId = extractUserId(request);
    return this.getUserGroupsUseCase.execute(userId, onlyActive ?? true, eventId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getGroupById(@Param('id') id: string): Promise<GroupDto> {
    return this.getGroupByIdUseCase.execute(id);
  }

  @Get(':id/members')
  @UseGuards(AuthGuard)
  async getGroupMembers(
    @Param('id') id: string,
    @Req() request: any
  ): Promise<GroupMemberDto[]> {
    const userId = extractUserId(request);
    return this.getGroupMembersUseCase.execute(id, userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Req() request: any
  ): Promise<GroupDto> {
    const userId = extractUserId(request);
    return this.updateGroupUseCase.execute(id, updateGroupDto, userId);
  }

  @Delete(':id/leave')
  @UseGuards(AuthGuard)
  async leaveGroup(
    @Param('id') id: string,
    @Req() request: any
  ): Promise<{ success: boolean; message: string }> {
    const userId = extractUserId(request);
    return this.leaveGroupUseCase.execute(id, userId);
  }

  @Delete(':id/members/:memberId')
  @UseGuards(AuthGuard)
  async removeGroupMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Req() request: any
  ): Promise<{ success: boolean; message: string }> {
    const userId = extractUserId(request);
    return this.removeGroupMemberUseCase.execute(id, memberId, userId);
  }

  @Patch(':id/close')
  @UseGuards(AuthGuard)
  async closeGroup(
    @Param('id') id: string,
    @Req() request: any
  ): Promise<GroupDto> {
    const userId = extractUserId(request);
    return this.closeGroupUseCase.execute(id, userId);
  }

  @Post(':id/regenerate-code')
  @UseGuards(AuthGuard)
  async regenerateInvitationCode(
    @Param('id') id: string,
    @Req() request: any
  ): Promise<{ success: boolean; message: string; invitationCode?: string }> {
    const userId = extractUserId(request);
    return this.regenerateInvitationCodeUseCase.execute(id, userId);
  }

  @Patch(':id/members/:memberId/role')
  @UseGuards(AuthGuard)
  async changeGroupMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body('role') role: GroupMemberRole,
    @Req() request: any
  ) {
    const userId = extractUserId(request);
    return this.changeGroupMemberRoleUseCase.execute(id, memberId, role, userId);
  }

  @Post(':id/invite')
  @UseGuards(AuthGuard)
  async inviteUserToGroup(
    @Param('id') id: string,
    @Body('userId') targetUserId: string,
    @Req() request: any
  ) {
    const inviterId = extractUserId(request);
    return this.inviteUserToGroupUseCase.execute(id, targetUserId, inviterId);
  }

  @Post('invitations/:groupId/respond')
  @UseGuards(AuthGuard)
  async respondToGroupInvitation(
    @Param('groupId') groupId: string,
    @Body('response') response: 'ACCEPT' | 'REJECT',
    @Req() request: any
  ) {
    const userId = extractUserId(request);
    const invitationResponse = response === 'ACCEPT' 
      ? InvitationResponse.ACCEPT 
      : InvitationResponse.REJECT;
    
    return this.respondToGroupInvitationUseCase.execute(groupId, userId, invitationResponse);
  }

  @Get('invitations')
  @UseGuards(AuthGuard)
  async getPendingInvitations(
    @Req() request: any
  ): Promise<GroupMemberDto[]> {
    return this.getPendingGroupInvitationsUseCase.execute(extractUserId(request));
  }
} 