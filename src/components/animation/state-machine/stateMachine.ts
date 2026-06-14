import { ref, computed } from 'vue';

export type BehaviorState = 'idle' | 'observe' | 'inspect' | 'signal' | 'celebrate' | 'return';

export function createStateMachine(initialState: BehaviorState = 'idle') {
  const currentState = ref<BehaviorState>(initialState);
  const previousState = ref<BehaviorState | null>(null);

  const transitionTo = (nextState: BehaviorState) => {
    if (currentState.value === nextState) return;
    previousState.value = currentState.value;
    currentState.value = nextState;
  };

  const isState = (state: BehaviorState) => computed(() => currentState.value === state);

  return {
    currentState,
    previousState,
    transitionTo,
    isState
  };
}
