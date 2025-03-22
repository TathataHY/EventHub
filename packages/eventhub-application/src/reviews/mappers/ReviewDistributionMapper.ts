import { Mapper } from '../../core/interfaces/Mapper';
import { ReviewDistributionDTO } from '../dtos/ReviewDistributionDTO';

/**
 * Mapper para convertir entre la distribución de reseñas del dominio y su DTO
 */
export class ReviewDistributionMapper implements Mapper<any, ReviewDistributionDTO> {
  /**
   * Convierte la distribución de reseñas del dominio al DTO
   * @param domain Objeto de distribución de reseñas del dominio
   * @returns DTO de distribución de reseñas
   */
  toDTO(domain: any): ReviewDistributionDTO {
    if (!domain) {
      // Si no hay datos, devolver una distribución vacía
      return {
        total: 0,
        average: 0,
        distribution: {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0
        }
      };
    }
    
    return {
      total: domain.total || 0,
      average: domain.average || 0,
      distribution: {
        '1': domain.distribution?.['1'] || 0,
        '2': domain.distribution?.['2'] || 0,
        '3': domain.distribution?.['3'] || 0,
        '4': domain.distribution?.['4'] || 0,
        '5': domain.distribution?.['5'] || 0
      }
    };
  }

  /**
   * Convierte un DTO de distribución de reseñas a un objeto del dominio
   * (No se utiliza generalmente ya que la distribución es calculada)
   * @param dto DTO de distribución de reseñas
   * @returns Objeto de distribución de reseñas del dominio
   */
  toDomain(dto: ReviewDistributionDTO): any {
    if (!dto) {
      return null;
    }
    
    return {
      total: dto.total,
      average: dto.average,
      distribution: {
        '1': dto.distribution['1'],
        '2': dto.distribution['2'],
        '3': dto.distribution['3'],
        '4': dto.distribution['4'],
        '5': dto.distribution['5']
      }
    };
  }
} 