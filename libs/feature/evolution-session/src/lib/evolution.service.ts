import { Injectable } from '@angular/core';
import { EvolutionSessionEntity } from '@boardgames/data/evolution-session';

@Injectable({
  providedIn: 'root'
})
export class EvolutionService {
  #session!: EvolutionSessionEntity;
  set session(session: EvolutionSessionEntity) {
    this.#session = session;
  }

}
