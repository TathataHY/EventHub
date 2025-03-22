import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventRepository } from 'eventhub-domain';
import { EventEntity } from '../entities/event.entity';

@Injectable()
export class EventRepositoryImpl implements EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async findById(id: string): Promise<Event | null> {
    const eventEntity = await this.eventRepository.findOne({ 
      where: { id },
      relations: ['organizer'] 
    });
    if (!eventEntity) return null;
    return this.toDomain(eventEntity);
  }

  async findAll(): Promise<Event[]> {
    const eventEntities = await this.eventRepository.find({
      relations: ['organizer']
    });
    return eventEntities.map(entity => this.toDomain(entity));
  }

  async findByOrganizerId(organizerId: string): Promise<Event[]> {
    const eventEntities = await this.eventRepository.find({
      where: { organizerId },
      relations: ['organizer']
    });
    return eventEntities.map(entity => this.toDomain(entity));
  }

  async save(event: Event): Promise<Event> {
    const eventEntity = this.toEntity(event);
    const savedEntity = await this.eventRepository.save(eventEntity);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }

  private toDomain(entity: EventEntity): Event {
    return new Event({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      startDate: entity.startDate,
      endDate: entity.endDate,
      location: entity.location,
      organizerId: entity.organizerId,
      capacity: entity.capacity,
      attendees: entity.attendees || [],
      isActive: entity.isActive,
      tags: entity.tags || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toEntity(domain: Event): EventEntity {
    const entity = new EventEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.startDate = domain.startDate;
    entity.endDate = domain.endDate;
    entity.location = domain.location;
    entity.organizerId = domain.organizerId;
    entity.capacity = domain.capacity;
    entity.attendees = domain.attendees;
    entity.isActive = domain.isActive;
    entity.tags = domain.tags;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
} 