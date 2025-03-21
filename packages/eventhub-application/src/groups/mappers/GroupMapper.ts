import { Group } from '@eventhub/shared/domain/groups/Group';
import { GroupDTO, CreateGroupDTO, GroupMemberDTO } from '../dtos/GroupDTO';

export class GroupMapper {
  /**
   * Convierte una entidad de dominio a DTO
   */
  static toDTO(domain: Group): GroupDTO {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      organizerId: domain.organizerId,
      members: domain.members.map(member => this.toMemberDTO(member)),
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades de dominio a DTOs
   */
  static toDTOList(domains: Group[]): GroupDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Convierte un DTO de creación a entidad de dominio
   */
  static toDomain(dto: CreateGroupDTO): Group {
    return new Group({
      name: dto.name,
      description: dto.description,
      organizerId: dto.organizerId,
      members: dto.initialMembers?.map(userId => ({
        userId,
        role: 'MEMBER',
        joinedAt: new Date()
      })) || []
    });
  }

  /**
   * Convierte un miembro de dominio a DTO
   */
  private static toMemberDTO(member: Group['members'][0]): GroupMemberDTO {
    return {
      userId: member.userId,
      role: member.role,
      joinedAt: member.joinedAt
    };
  }
} 