# TODO

Cosas que quedaron fuera del alcance de un ticket y esperan uno propio.

- **Nombre del organizador en el detalle del evento y en la card.** El backend solo devuelve `organizationId`. Próximo ticket cuando el backend libere la US que lista las organizaciones. Lo dejaron afuera las stories 12 y 15.
- **Mover lo que quedó en `catalog/lib/` según el ADR 0003.** `eventFormat.ts` va a `utils/`, `eventNotice.ts` a `domain/`, y hay que revisar `eventId.ts` y `venueMap.ts`. Los tests commiteados se mueven con `git mv`. Lo dejó afuera la story 16, porque `EventNotice` está fuera de su alcance.
- **Átomo `Skeleton` compartido.** `EventCardSkeleton`, `EventDetailSkeleton` y `EventSectorsSkeleton` copian el mismo pulso (`animate-pulse bg-line motion-reduce:animate-none`). Con tres casos ya conviene un átomo en `shared/components/atoms/`. Lo dejó afuera la story 16.
- **Imagen del evento en el hero del detalle y en la card.** El backend todavía no tiene `imageUrl`. Próximo ticket cuando se libere esa US. Lo dejaron afuera las stories 12 y 15.
