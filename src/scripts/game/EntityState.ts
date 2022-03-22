import {EntityEventList} from "@/scripts/game/EntityEventList";
import {Emitter} from "@/scripts/game/Emitter";

//实体状态
export class EntityState {
    events: EntityEventList;
    emitters: Set<Emitter> = new Set<Emitter>();
    time = 0;
    totalTime = 0;

    constructor(events: EntityEventList) {
        this.events = events;
    }

    update(time: number) {
        this.time += time;
        this.totalTime += time;
    }

    addEmitters(...emitters: Emitter[]) {
        for (const emitter of emitters) {
            this.emitters.add(emitter);
            emitter.active = false;
        }
    }
}

//实体的状态机
export class EntityStates {
    states: Map<string, EntityState> = new Map<string, EntityState>();
    _currentState?: EntityState;

    get currentState() {
        if (this._currentState)
            return this._currentState;
        const state: EntityState = new EntityState(new EntityEventList());
        this.states.set('default', state);
        this.currentState = state;
        return state;
    }

    set currentState(value: EntityState) {
        this._currentState = value;
    }

    addState(name: string, state: EntityState) {
        this.states.set(name, state);
    }

    changeState(name: string, reset = true) {
        const state = this.states.get(name);
        if (state) {
            for (const emitter of this.currentState.emitters)
                emitter.active = false;
            this.currentState = state;
            this.currentState.time = 0;
            for (const emitter of this.currentState.emitters) {
                emitter.active = true;
                if (reset)
                    emitter.reset();
            }
            if(reset){
                state.events.reset();
            }
        }
    }
}
