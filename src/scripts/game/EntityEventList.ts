import {PropMutation, PropTransformer} from "@/scripts/engine/PropTransformer";

export interface ConditionFunc {
    (): boolean;
}

export class EntityEvent {
    protected readonly condition: ConditionFunc | null;
    protected transformer: PropTransformer | null;
    protected start = false;

    constructor(condition: ConditionFunc | null, transformer: PropTransformer | null) {
        this.condition = condition;
        this.transformer = transformer;
    }

    update(time: number): void {
        if (!this.start) {
            this.start = this.condition ? this.condition() : true;
        }
        if (this.start) {
            this.transformer?.update(time);
        }
    }

    get isOver(): boolean {
        if (this.transformer)
            return this.transformer.isOver
        return false;
    }

    reset() {
        this.transformer?.reset();
        this.start = false;
    }
}

export class EntityEventList extends EntityEvent {
    private readonly events: Set<EntityEvent>;
    private currentEvents: Set<EntityEvent>;
    repeatTime: number;
    private currentRepeatTime: number = 0;
    currentPeriodTime = 0;

    constructor(condition: ConditionFunc | null = null, repeatTime: number = 1) {
        super(condition, null);
        this.events = new Set<EntityEvent>();
        this.currentEvents = new Set<EntityEvent>();
        this.repeatTime = repeatTime;
    }

    update(time: number): void {
        if (!this.start) {
            this.start = this.condition ? this.condition() : true;
        }
        if (!this.start)
            return;
        this.currentPeriodTime += time;
        if (this.currentEvents.size <= 0) {
            if (this.repeatTime == -1 || this.currentRepeatTime++ < this.repeatTime) {
                this.currentEvents = new Set<EntityEvent>(this.events);
                for (const entityEvent of this.currentEvents)
                    entityEvent.reset();
                this.currentPeriodTime = 0;
            } else {
                this.events.clear();
            }
        }
        for (const entityEvent of this.currentEvents) {
            entityEvent.update(time);
            if (entityEvent.isOver)
                this.currentEvents.delete(entityEvent);
        }
    }

    addEvent(entityEvent: EntityEvent): void {
        this.events.add(entityEvent);
    }

    get isOver(): boolean {
        return this.events.size <= 0;
    }
}
