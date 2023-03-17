enum AnimationState {
    Start,
    End,
    ForwardRunning,
    BackwardRunning,
}

export class CanvasAnimation {
    duration: number
    execution: (advancement: number) => void

    advancement: number = 0
    state: AnimationState = AnimationState.Start
    previous_timestamp: DOMHighResTimeStamp | null = null

    constructor(duration: number, execution: (advancement: number) => void) {
        this.duration = duration
        this.execution = execution
    }

    start() {
        if (this.state === AnimationState.Start) {
            this.state = AnimationState.ForwardRunning
            this.previous_timestamp = null
            requestAnimationFrame(this.running.bind(this))
        } else if (this.state === AnimationState.BackwardRunning) {
            this.state = AnimationState.ForwardRunning
        }
    }

    stop() {
        if (this.state === AnimationState.End) {
            this.previous_timestamp = null
            this.state = AnimationState.BackwardRunning
            requestAnimationFrame(this.running.bind(this))
        } else if (this.state === AnimationState.ForwardRunning) {
            this.state = AnimationState.BackwardRunning
        }
    }

    running(timestamp: DOMHighResTimeStamp) {
        // find how much time has passed
        let delta_time = this.previous_timestamp === null ? 0 : timestamp - this.previous_timestamp

        // update the previous timestamp
        this.previous_timestamp = timestamp

        // update the advancement
        if (this.state === AnimationState.ForwardRunning) {
            this.advancement += delta_time
        } else if (this.state === AnimationState.BackwardRunning) {
            this.advancement -= delta_time
        }

        // if we are at the forward end of the animation, stop
        if (this.state === AnimationState.ForwardRunning && this.advancement >= this.duration) {
            this.state = AnimationState.End
            this.advancement = this.duration
            this.execution(1)
        }
        // if we are at the backward end of the animation, stop
        else if (this.state === AnimationState.BackwardRunning && this.advancement <= 0) {
            this.state = AnimationState.Start
            this.advancement = 0
            this.execution(0)
        }
        // if we are running forward, update the advancement
        else {
            this.execution(this.advancement / this.duration)
            requestAnimationFrame(this.running.bind(this))
        }
    }
}
