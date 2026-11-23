# TODO

Cosas que quedaron fuera del alcance de un ticket y esperan uno propio.

- **Nombre del organizador en el detalle del evento y en la card.** El backend solo devuelve `organizationId`. Próximo ticket cuando el backend libere la US que lista las organizaciones. Lo dejaron afuera las stories 12 y 15.
- **Mover lo que quedó en `catalog/lib/` según el ADR 0003.** `eventNotice.ts` va a `domain/` y hay que revisar `venueMap.ts` (`eventFormat.ts` y `eventId.ts` ya pasaron a `shared/utils/` en la story 19). Los tests commiteados se mueven con `git mv`. Lo dejó afuera la story 16, porque `EventNotice` está fuera de su alcance.
- **Migrar los skeletons de catalog al átomo `Skeleton`.** El átomo ya existe en `shared/components/atoms/Skeleton.tsx` (story 19, lo usa `SeatMapSkeleton`). `EventCardSkeleton`, `EventDetailSkeleton` y `EventSectorsSkeleton` todavía copian el pulso (`animate-pulse bg-line motion-reduce:animate-none`). Lo dejó afuera la story 19, porque los skeletons de catalog estaban fuera de su alcance.
- **Imagen del evento en el hero del detalle y en la card.** El backend todavía no tiene `imageUrl`. Próximo ticket cuando se libere esa US. Lo dejaron afuera las stories 12 y 15.
