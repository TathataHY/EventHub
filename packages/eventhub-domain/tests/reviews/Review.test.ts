import { 
  Review, 
  ReviewCreateProps,
  ReviewProps,
  ReviewCreateException,
  ReviewUpdateException
} from '../../src/reviews';

describe('Review Entity', () => {
  // Datos válidos para crear una reseña
  const validReviewProps: ReviewCreateProps = {
    eventId: 'event-1',
    userId: 'user-1',
    score: 5,
    content: 'Excelente evento, muy bien organizado'
  };

  describe('create', () => {
    it('debe crear una reseña válida con los parámetros correctos', () => {
      const review = Review.create(validReviewProps);
      
      expect(review).toBeDefined();
      expect(review.id).toBeDefined();
      expect(review.eventId).toBe(validReviewProps.eventId);
      expect(review.userId).toBe(validReviewProps.userId);
      expect(review.score).toBe(validReviewProps.score);
      expect(review.content).toBe(validReviewProps.content);
      expect(review.isActive).toBe(true);
      expect(review.isVerified).toBe(false);
      expect(review.createdAt).toBeInstanceOf(Date);
      expect(review.updatedAt).toBeInstanceOf(Date);
    });

    it('debe crear una reseña sin contenido textual', () => {
      const props = { ...validReviewProps, content: undefined };
      const review = Review.create(props);
      
      expect(review).toBeDefined();
      expect(review.content).toBeNull();
    });

    it('debe asignar valores por defecto a las propiedades opcionales', () => {
      const review = Review.create(validReviewProps);
      
      expect(review.isActive).toBe(true);
      expect(review.isVerified).toBe(false);
    });

    it('debe generar un ID único si no se proporciona', () => {
      const review = Review.create(validReviewProps);
      const review2 = Review.create(validReviewProps);
      
      expect(review.id).toBeDefined();
      expect(review.id).not.toBe(review2.id);
    });

    it('debe lanzar error si el eventId no se proporciona', () => {
      const props = { ...validReviewProps, eventId: '' };
      
      expect(() => {
        Review.create(props);
      }).toThrow(ReviewCreateException);
    });

    it('debe lanzar error si el userId no se proporciona', () => {
      const props = { ...validReviewProps, userId: '' };
      
      expect(() => {
        Review.create(props);
      }).toThrow(ReviewCreateException);
    });

    it('debe lanzar error si la puntuación es menor que 1', () => {
      const props = { ...validReviewProps, score: 0 };
      
      expect(() => {
        Review.create(props);
      }).toThrow(ReviewCreateException);
    });

    it('debe lanzar error si la puntuación es mayor que 5', () => {
      const props = { ...validReviewProps, score: 6 };
      
      expect(() => {
        Review.create(props);
      }).toThrow(ReviewCreateException);
    });
  });

  describe('reconstitute', () => {
    it('debe reconstruir una reseña desde sus propiedades', () => {
      const props: ReviewProps = {
        id: 'review-1',
        eventId: 'event-1',
        userId: 'user-1',
        score: 4,
        content: 'Buen evento',
        isActive: true,
        isVerified: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      };

      const review = Review.reconstitute(props);
      
      expect(review.id).toBe(props.id);
      expect(review.eventId).toBe(props.eventId);
      expect(review.userId).toBe(props.userId);
      expect(review.score).toBe(props.score);
      expect(review.content).toBe(props.content);
      expect(review.isActive).toBe(props.isActive);
      expect(review.isVerified).toBe(props.isVerified);
      expect(review.createdAt).toBe(props.createdAt);
      expect(review.updatedAt).toBe(props.updatedAt);
    });
  });

  describe('updateContent', () => {
    it('debe actualizar el contenido de la reseña', () => {
      const review = Review.create(validReviewProps);
      const newContent = 'Contenido actualizado';
      
      const updatedReview = review.updateContent(newContent);
      
      expect(updatedReview.content).toBe(newContent);
      expect(updatedReview.updatedAt).not.toBe(review.updatedAt);
    });

    it('debe permitir establecer el contenido a null', () => {
      const review = Review.create(validReviewProps);
      
      const updatedReview = review.updateContent(null);
      
      expect(updatedReview.content).toBeNull();
    });

    it('debe lanzar error si la reseña está inactiva', () => {
      const props: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review = Review.reconstitute(props);
      
      expect(() => {
        review.updateContent('Nuevo contenido');
      }).toThrow(ReviewUpdateException);
    });

    it('debe lanzar error si la reseña está verificada', () => {
      const props: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review = Review.reconstitute(props);
      
      expect(() => {
        review.updateContent('Nuevo contenido');
      }).toThrow(ReviewUpdateException);
    });
  });

  describe('updateScore', () => {
    it('debe actualizar la puntuación de la reseña', () => {
      const review = Review.create(validReviewProps);
      const newScore = 3;
      
      const updatedReview = review.updateScore(newScore);
      
      expect(updatedReview.score).toBe(newScore);
      expect(updatedReview.updatedAt).not.toBe(review.updatedAt);
    });

    it('debe lanzar error si la puntuación es menor que 1', () => {
      const review = Review.create(validReviewProps);
      
      expect(() => {
        review.updateScore(0);
      }).toThrow(ReviewUpdateException);
    });

    it('debe lanzar error si la puntuación es mayor que 5', () => {
      const review = Review.create(validReviewProps);
      
      expect(() => {
        review.updateScore(6);
      }).toThrow(ReviewUpdateException);
    });

    it('debe lanzar error si la reseña está inactiva', () => {
      const props: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review = Review.reconstitute(props);
      
      expect(() => {
        review.updateScore(4);
      }).toThrow(ReviewUpdateException);
    });

    it('debe lanzar error si la reseña está verificada', () => {
      const props: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review = Review.reconstitute(props);
      
      expect(() => {
        review.updateScore(4);
      }).toThrow(ReviewUpdateException);
    });
  });

  describe('verify', () => {
    it('debe marcar la reseña como verificada', () => {
      const review = Review.create(validReviewProps);
      
      const verifiedReview = review.verify();
      
      expect(verifiedReview.isVerified).toBe(true);
      expect(verifiedReview.updatedAt).not.toBe(review.updatedAt);
    });

    it('debe retornar la misma instancia si ya está verificada', () => {
      const props: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review = Review.reconstitute(props);
      const verifiedReview = review.verify();
      
      expect(verifiedReview).toBe(review);
    });

    it('debe lanzar error si la reseña está inactiva', () => {
      const props: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review = Review.reconstitute(props);
      
      expect(() => {
        review.verify();
      }).toThrow(ReviewUpdateException);
    });
  });

  describe('deactivate', () => {
    it('debe desactivar la reseña', () => {
      const review = Review.create(validReviewProps);
      
      const deactivatedReview = review.deactivate();
      
      expect(deactivatedReview.isActive).toBe(false);
      expect(deactivatedReview.updatedAt).not.toBe(review.updatedAt);
    });

    it('debe retornar la misma instancia si ya está inactiva', () => {
      const props: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review = Review.reconstitute(props);
      const deactivatedReview = review.deactivate();
      
      expect(deactivatedReview).toBe(review);
    });
  });

  describe('activate', () => {
    it('debe activar la reseña', () => {
      const props: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review = Review.reconstitute(props);
      const activatedReview = review.activate();
      
      expect(activatedReview.isActive).toBe(true);
      expect(activatedReview.updatedAt).not.toBe(review.updatedAt);
    });

    it('debe retornar la misma instancia si ya está activa', () => {
      const review = Review.create(validReviewProps);
      const activatedReview = review.activate();
      
      expect(activatedReview).toBe(review);
    });
  });

  describe('equals', () => {
    it('debe retornar true si dos reseñas tienen el mismo ID', () => {
      const props: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review1 = Review.reconstitute(props);
      const review2 = Review.reconstitute(props);
      
      expect(review1.equals(review2)).toBe(true);
    });

    it('debe retornar false si dos reseñas tienen IDs diferentes', () => {
      const props1: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-1',
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const props2: ReviewProps = {
        ...validReviewProps as unknown as ReviewProps,
        id: 'review-2',
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const review1 = Review.reconstitute(props1);
      const review2 = Review.reconstitute(props2);
      
      expect(review1.equals(review2)).toBe(false);
    });

    it('debe retornar false si se compara con otro tipo de entidad', () => {
      const review = Review.create(validReviewProps);
      const otherEntity = { id: review.id } as any;
      
      expect(review.equals(otherEntity)).toBe(false);
    });
  });

  describe('toObject', () => {
    it('debe convertir la reseña a un objeto plano', () => {
      const review = Review.create(validReviewProps);
      const obj = review.toObject();
      
      expect(obj.id).toBe(review.id);
      expect(obj.eventId).toBe(review.eventId);
      expect(obj.userId).toBe(review.userId);
      expect(obj.score).toBe(review.score);
      expect(obj.content).toBe(review.content);
      expect(obj.isActive).toBe(review.isActive);
      expect(obj.isVerified).toBe(review.isVerified);
      expect(obj.createdAt).toBe(review.createdAt);
      expect(obj.updatedAt).toBe(review.updatedAt);
    });
  });
}); 